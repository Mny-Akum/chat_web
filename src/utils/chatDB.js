const dbUtil = {
    /**
     * 对于indexedDB的使用
     * 1.仓库store,indexedDB没有表的概念，只有仓库，可以将仓库理解为表，即一个仓库对应一张表
     * 2.索引，通过给对应的表字段添加索引，来加快查找速率
     * 3.游标cursor 想象成java中数组的指针，查询某一数据时，需要用到游标，让游标一行一行向下走，走到的地方便会返回这一行数据
     * 4.事务，indexedDB支持事务
     */
    /** 
     * 消息表结构：
     * 数据库：chat
     * 表名 chatMessage
     * id           主键 自增
     * from_user    发送人
     * to_user      接收人
     * text         发送文本
     * send_time    发送时间(yyyy-MM-dd HH:mm)
     * type         消息类型,个人信息和群组信息(single,group)
     * showTime     是否显示时间，bool类型
    */
    //打开数据库
    openDB(dbName,version = 1) {
        return new Promise((resolve,reject)=>{
            //兼容浏览器
            var indexedDB = window.indexedDB || window.mozIndexedDB || webkitIndexedDB || window.msIndexedDB
            let db;
            //打开数据库,若没有会创建
            const request  = indexedDB.open(dbName,version)
            request.onsuccess = (event)=>{
                db = event.target.result;
                console.log("数据库打开成功");
                resolve(db);
            }
            request.onerror = (error)=>{
                console.log("数据库打开失败",error);
                reject(error);
            }
            //数据库创建或者更新时触发
            //我们在这里面进行创建仓库的操作
            request.onupgradeneeded = (event)=>{
                db = event.target.result;
                console.log("数据库更新");
                var messageStore;
                messageStore = db.createObjectStore("chatMessage",{
                    keyPath:"id",
                    autoIncrement:true
                })
                messageStore.createIndex("from_user","from",{unique:false});
                messageStore.createIndex("to_user","to",{unique:false});
                messageStore.createIndex("text","message",{unique:false});
                messageStore.createIndex("send_time","time",{unique:false});
                messageStore.createIndex("type","type",{unique:false});
            }
        })
    },
    insertData(db,storeName,data){
        return new Promise((resolve,reject)=>{
            var request = db.transaction([storeName],"readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
                            .objectStore(storeName)               //仓库对象
                            .add(data)
            request.onsuccess = (event)=>{
                console.log("写入成功")
            }
            request.onerror = (error)=>{
                console.log("写入失败",error);
            }
        })
    },
    //通过主键查询数据
    selectDataByKey(db,storeName,key){
        return new Promise((resolve,reject)=>{
            let transaction = db.transaction([storeName]);
            let objectStore = transaction.objectStore(storeName);
            var request = objectStore.get(key);
            request.onerror = (error)=>{
                console.log("通过key值查询失败",error);
                reject(error);
            }
            request.onsuccess = (event)=>{
                resolve(request.result);
            }

        })
    },
    //通过游标查询数据
    selectDataByCursor(db,storeName){
        return new Promise((resolve,reject)=>{
            let list = [];
            var store = db
                        .transaction(storeName,"readwrite")
                        .objectStore(storeName);
            var request = store.openCursor();
            request.onsuccess = (event)=>{
                let cursor = event.target.result;
                if(cursor){
                    list.push(cursor.value);
                    cursor.continue();
                }else{
                    resolve(list)
                }
            }
            request.error = (error)=>{
                reject(error)
            }
        })
    },
    //通过索引查询数据
    selectDataByIndex(db,storeName,indexName,indexValue){
        return new Promise((resolve,reject)=>{
            var store = db
                        .transaction(storeName,"readwrite")
                        .objectStore(storeName);
            var request = store.index(indexName).get(indexValue);
            request.onsuccess = (event)=>{
                let result = event.target.result;
                resolve(result)
            }
            request.onerror = (error)=>{
                console.log("selectDataByIndex",error)
                reject(error);
            }
        })
    },
    //通过游标+索引查询数据
    selectData(db,storeName,indexName,indexValue,pageNum,pageSize){
        return new Promise((resolve,reject)=>{
            let list = [];
            let count = 0;
            let advance = true; //标识游标是否还未跳过
            let store = db.transaction(storeName, "readwrite").objectStore(storeName);
            let request = store
                            .index(indexName)
                            .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
            
            request.onsuccess = (event) => {
                var cursor = event.target.result;
                if(pageNum > 1 && advance){
                    //游标跳过
                    advance = false;
                    cursor.advance((pageNum - 1) * pageSize);
                    return
                }
                if (cursor && (count < pageSize || !pageSize || !pageNum)) {
                    // 必须要检查
                    list.push(cursor.value);
                    count++;
                    cursor.continue(); // 遍历了存储对象中的所有内容
                } else {
                    let data = {
                        store:storeName,
                        indexName,
                        indexValue,
                        pageNum,
                        pageSize,
                        list
                    }
                    resolve(data)   
                }   
            };

            request.onerror = (error) => {
                console.log("selectData",error)
                reject(error);
            };
        })
    }
}
//封装类
class ChatDB{
    constructor(dbName,storeName){
        this.dbName = dbName
        this.storeName = storeName
        this.db = null;
    }
    // 进行初始化
    async init(){
        if(!this.db){
            this.db = await dbUtil.openDB(this.dbName);
        }
    }
    async insertData(data){
        await this.init();
        return dbUtil.insertData(this.db,this.storeName,data);
    }
    async selectDataByKey(key){
        await this.init();
        return dbUtil.selectDataByKey(this.db,this.storeName,key);
    }
    async selectDataByCursor(){
        await this.init();
        return dbUtil.selectDataByCursor(this.db,this.storeName);
    }
    async selectDataByIndex(indexName,indexValue){
        await this.init();
        return dbUtil.selectDataByIndex(this.db,this.storeName,indexName,indexValue);
    }
    async selectData(indexName,indexValue,pageNum,pageSize){
        await this.init();
        return dbUtil.selectData(this.db,this.storeName,indexName,indexValue,pageNum,pageSize);
    }
}
export {dbUtil,ChatDB}