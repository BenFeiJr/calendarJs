const calendarJs = {
    version: '0.0.1',
    _getDateInstance: function (date) {
        if (typeof date === 'string') {
            date = date.replace(/-/g, '/');
        }

        return new Date(date);
    },

    /**
     * 获取year年month月有多少天
     * @param {number} year
     * @param {number} month
     * @return {number}
     */
    getDays: function (year, month) {
        const isLeapYear = (year) => {
            year = parseInt(year);
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        };
        const daysOfMonth = {
            1: 31,
            2: isLeapYear(year) ? 29 : 28,
            3: 31,
            4: 30,
            5: 31,
            6: 30,
            7: 31,
            8: 31,
            9: 30,
            10: 31,
            11: 30,
            12: 31
        };
        return daysOfMonth[month];
    },

    /**
     * beginDate到endDate按照日历的格式返回
     * @param {Date | string} beginDate
     * @param {Date | string} endDate
     * @return {Object} 如下
     * {
     *      // 年
     *      2018: {
     *          // 月
     *          1: [
     *              // 周
     *              [
     *                  // 周一到周日的天
     *                  {
     *                      day: 1,
     *                      fullDate: { year: 2018, month: 1, day: 1 }
     *                  }, {}, {}, {}, {}, {}, {}
     *              ]
     *              ...
     *          ]
     *          ...
     *      }
     *      ...
     * }
     */
    getCalendar: function (beginDate = new Date('1970/1/1'), endDate = new Date()) {
        const calendarData = {};

        const beginDateMap = {
            year: this.getYear(beginDate),
            month: this.getMonth(beginDate),
            day: this.getDay(beginDate)
        };
        const endDateMap = {
            year: this.getYear(endDate),
            month: this.getMonth(endDate),
            day: this.getDay(endDate)
        };

        for (let loopYear = beginDateMap.year; loopYear <= endDateMap.year; loopYear++) {
            const isBeginDateYear = loopYear === beginDateMap.year;
            const isEndDateYear = loopYear === endDateMap.year;
            const loopMonthBegin = isBeginDateYear ? beginDateMap.month : 1;
            const loopMonthEnd = isEndDateYear ? endDateMap.month : 12;

            calendarData[loopYear] = {};

            for (let loopMonth = loopMonthBegin; loopMonth <= loopMonthEnd; loopMonth++) {
                const isBeginDateMonth = loopMonth === beginDateMap.month;
                const isEndDateMonth = loopMonth === endDateMap.month;

                calendarData[loopYear][loopMonth] = [];

                for (let loopDay = 1; loopDay <= this.getDays(loopYear, loopMonth); loopDay++) {
                    let isOverRange = false;

                    if (isBeginDateYear && isBeginDateMonth && loopDay < beginDateMap.day) {
                        isOverRange = true;
                    }
                    if (isEndDateYear && isEndDateMonth && loopDay > endDateMap.day) {
                        isOverRange = true;
                    }

                    const l = calendarData[loopYear][loopMonth].length;
                    if (l === 0 || calendarData[loopYear][loopMonth][l - 1][6].day != null) {
                        calendarData[loopYear][loopMonth].push(Array.of({}, {}, {}, {}, {}, {}, {}));
                    }

                    const newL = calendarData[loopYear][loopMonth].length;
                    const loopDate = new Date(`${loopYear}/${loopMonth}/${loopDay}`);
                    const dayOfWeek = loopDate.getDay() || 7;
                    const index = dayOfWeek - 1;
                    calendarData[loopYear][loopMonth][newL - 1][index] = {
                        day: loopDay,
                        isOverRange: isOverRange,
                        fullDate: {
                            year: loopYear,
                            month: loopMonth,
                            day: loopDay
                        }
                    };
                }
            }
        }

        return calendarData;
    },

    getNextMonthCalendar: function (currDate) {
        const nextDate = this._getDateInstance(this.nextMonth(currDate));
        const nextDate_year = this.getYear(nextDate);
        const nextDate_month = this.getMonth(nextDate);
        const days = this.getDays(nextDate_year, nextDate_month);
        const beginDate = new Date(`${nextDate_year}/${nextDate_month}/${1}`);
        const endDate = new Date(`${nextDate_year}/${nextDate_month}/${days}`);

        return this.getCalendar(beginDate, endDate);
    },

    getPrevMonthCalendar: function (currDate) {
        const prevDate = this._getDateInstance(this.prevMonth(currDate));
        const prevDate_year = this.getYear(prevDate);
        const prevDate_month = this.getMonth(prevDate);
        const days = this.getDays(prevDate_year, prevDate_month);
        const beginDate = new Date(`${prevDate_year}/${prevDate_month}/${1}`);
        const endDate = new Date(`${prevDate_year}/${prevDate_month}/${days}`);

        return this.getCalendar(beginDate, endDate);
    },

    nextMonth: function (currDate) {
        currDate = this._getDateInstance(currDate);
        const year = currDate.getFullYear();
        const month = currDate.getMonth() + 1;

        return `${month === 12 ? year + 1 : year}/${month === 12 ? 1 : month + 1}`;
    },

    prevMonth: function (currDate) {
        currDate = this._getDateInstance(currDate);
        const year = currDate.getFullYear();
        const month = currDate.getMonth() + 1;

        return `${month === 1 ? year - 1 : year}/${month === 1 ? 12 : month - 1}`;
    },

    getYear: function (date = new Date()) {
        return this._getDateInstance(date).getFullYear();
    },

    getMonth: function (date = new Date()) {
        return this._getDateInstance(date).getMonth() + 1;
    },

    getDay: function (date = new Date()) {
        return this._getDateInstance(date).getDate();
    }
};

export default calendarJs;
