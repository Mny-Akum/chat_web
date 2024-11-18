<template>
  <div id="calendar">
    <div class="shell">
        <header>
            <div class="day">{{month}}</div>
            <div class="month">{{monthEnglish}}</div>
        </header>
        <table class="calendar">
            <thead>
                <tr>
                    <td>Mon</td>
                    <td>Tue</td>
                    <td>Wed</td>
                    <td>Thu</td>
                    <td>Fri</td>
                    <td>Sat</td>
                    <td>Sun</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(week,index) in calenderWeek" :key="index">
                    <td :class="{
                        'prev-month':!calenderStyle[week][index],
                        'current-day':(date == nowDate && calenderStyle[week][index])
                        }" v-for="(date,index) in calenderDate[week]" :key="index"
                    >{{date}}</td>
                </tr>
            </tbody>
        </table>
        <div class="ring-left"></div>
        <div class="ring-right"></div>
    </div>
  </div>
</template>
<script>
export default {
  name:"chatCalendar",
  data(){
    return {
        month:0,
        nowDate:null,
        calenderWeek:[],
        calenderDate:{},
        calenderStyle:{}
    }
  },
  mounted(){
    this.init()
  },
  computed:{
    monthEnglish(){
        let monthEn;
        switch(this.month){
            case 1: monthEn = 'January'; break;
            case 2: monthEn = 'February'; break;
            case 3: monthEn = 'March'; break;
            case 4: monthEn = 'April'; break;
            case 5: monthEn = 'May'; break;
            case 6: monthEn = 'June'; break;
            case 7: monthEn = 'July'; break;
            case 8: monthEn = 'August'; break;
            case 9: monthEn = 'September'; break;
            case 10: monthEn = 'October'; break;
            case 11: monthEn = 'November'; break;
            case 12: monthEn = 'December'; break;
        }
        return monthEn;
    }
  },
  methods:{
    init(){
        let date = new Date();
        this.nowDate = date.getDate();
        let nowMonth = date.getUTCMonth() + 1
        
        this.month = nowMonth
        date.setDate(1);
        date.setDate(date.getDate() - date.getDay() + 1);
        for(let i = 0; i < 6; i++){
            this.calenderWeek.push(i+1)
            this.calenderStyle[`${i+1}`] = []
            this.calenderDate[`${i+1}`] = []
            for(let j = 0; j < 7 ; j++){
                this.calenderDate[`${i+1}`].push(date.getDate());
                this.calenderStyle[`${i+1}`].push(date.getMonth()+1 == nowMonth);
                date.setDate(date.getDate() + 1)
            }
        }
    }
  }
}
</script>
<style scoped>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

body {
    background: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);
}

.shell {
    position: relative;
    width: 38rem;
    border-radius: 0 0 1rem 1rem;
    box-shadow: 0 1.4rem 3rem rgba(0, 0, 0, 0.2), 0 1.2rem 1rem rgba(0, 0, 0, 0.2);
}

.shell header {
    border-radius: 1rem 1rem 0 0;
    background: #e66b6b;
    color: #fff;
    padding: 3rem 2rem;
    background-image: url(./img/01.gif);
    background-size: cover;
}

.day {
    font-size: 8rem;
    font-weight: 900;
    line-height: 8rem;
}

.month {
    font-size: 4rem;
    line-height: 4rem;
}

.calendar {
    width: 100%;
    background: #fff;
    border-radius: 0 0 1rem 1rem;
    box-shadow: 0 2px 1px rgba(0, 0, 0, .2), 0 3px 1px #fff;
    color: #000000;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 0.8rem;
}

.calendar thead {
    color: #e66b6b;
    font-weight: 700;
    text-transform: uppercase;
}

.calendar td {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    text-align: center;
    font: 600 1.4rem '';
    transition: .2s;
}

.calendar tbody td:hover {
    background: #da89a2;
    color: #fff;
    font: 600 2rem '';
}

.current-day {
    color: #e66b6b;
}

.prev-month,
.next-month {
    color: #cacaca;
}

.ring-left,
.ring-right {
    position: absolute;
    top: 20rem;
}

.ring-left {
    left: 2rem;
}

.ring-right {
    right: 2rem;
}

.ring-left:before,
.ring-right:before {
    background: #fff;
    border-radius: 0.34rem;
    box-shadow: 0 3px 1px rgba(0, 0, 0, .3), 0 -1px 1px rgba(0, 0, 0, .2);
    content: "";
    display: inline-block;
    margin: 0.9rem;
    height: 2.6rem;
    width: 0.9rem;
}
</style>
