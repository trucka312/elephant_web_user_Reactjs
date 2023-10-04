import moment from 'moment';

export const formatDate = (date, format) => {
    const formattedDate = moment(date).format(format);
    return formattedDate;
}

export const formatGMT = (date) => {
    const formattedGMT = moment(date).toDate();
    return formattedGMT;
}


export const handleShowTime = (time) => {
    if (time) {
      const total = moment(moment()).diff(time);
      const days = Math.floor(total / 1000 / 60 / 60 / 24);
      const dayNowInWeek = moment().isoWeekday();
      const daySendedInWeek = moment(time).isoWeekday();

      let formatDate = "";

      if (days <= 7) {
        formatDate =
          daySendedInWeek === dayNowInWeek
            ? moment(time).format("HH:mm")
            : daySendedInWeek === 1
            ? `Thứ 2 ${moment(time).format("HH:mm")}`
            : daySendedInWeek === 2
            ? `Thứ 3 ${moment(time).format("HH:mm")}`
            : daySendedInWeek === 3
            ? `Thứ 4 ${moment(time).format("HH:mm")}`
            : daySendedInWeek === 4
            ? `Thứ 5 ${moment(time).format("HH:mm")}`
            : daySendedInWeek === 5
            ? `Thứ 6 ${moment(time).format("HH:mm")}`
            : daySendedInWeek === 6
            ? `Thứ 7 ${moment(time).format("HH:mm")}`
            : daySendedInWeek === 7
            ? `Chủ nhật ${moment(time).format("HH:mm")}`
            : "";
      } else {
        formatDate = `${moment(time).format("DD/MM/YYYY HH:mm")}`;
      }
      return formatDate;
    }
    return "";
  };

  export const getDateForChartHour = () => {
    var from = moment().format("YYYY-MM-DD");
    var to = from;
    return {
      from,
      to,
    };
  };

  export const getDateForChartWeek = () => {
    console.log(moment().day());
    if (moment().day() == 0) {
      return {
        from: moment().subtract(6, "days").format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      };
    }
    var weekStart = moment().clone().weekday(1).format("YYYY-MM-DD");
    var from = weekStart;
    var to = moment().format("YYYY-MM-DD");
    return {
      from,
      to,
    };
  };

  export const getDateForChartMonth = () => {
    var monthStart = moment().startOf("month").format("YYYY-MM-DD");
    var from = monthStart;
    var to = moment().format("YYYY-MM-DD");
    return {
      from,
      to,
    };
  };

  export const getDateForChartYear = () => {
    var monthStart = moment().format("YYYY");
    var from = "01-01-" + monthStart;
    var to = moment().format("YYYY-MM-DD");
    return {
      from,
      to,
    };
  };