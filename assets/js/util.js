import BasicData from "~/assets/js/data.js"

export default {
	
   txt_deal_with(txt){
    let reg = /(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/ig;
    let result = txt.replace(reg,function(item){
      return '<a href="' +item+ '" target="_blank">' +item+ '</a>';
    });
    return result;
  },
	
  getWeek (str) {
    if (!str) {
      return ''
    }
    let date = new Date(str)
    return date.getDay()
  },
  
  date (str, type) {
    if (!str) {
      return '';
    }

    let date = new Date(str);
    // 换算为时间戳
    let param_timestamp = date.getTime();
    let param_year = date.getFullYear();
    let param_month = date.getMonth() + 1;
    let param_day = date.getDate();
    let param_hours = date.getHours();
    let param_minutes = date.getMinutes();
    let param_seconds = date.getSeconds();

    let now = Date.now();
    let current_datetimt = new Date(now);

    let currdate_year = current_datetimt.getFullYear();
    let currdate_month = current_datetimt.getMonth() + 1;
    let currdate_day = current_datetimt.getDate();
    let currdate_hours = current_datetimt.getHours();
    let currdate_min = current_datetimt.getMinutes();
    let currdate_sec = current_datetimt.getSeconds();
    // 得到昨天的日期
    let get_curr_pre_datetime = new Date(current_datetimt.getTime() - 24*60*60*1000)
    let current_pre_date = get_curr_pre_datetime.getDate()

    let diff_seconds = Math.floor((now - param_timestamp) / 1000);
    let diff_minutes = Math.floor(diff_seconds / 60);
    let diff_hours = Math.floor(diff_minutes / 60);
    let diff_days = Math.floor(diff_hours / 24);
    let diff_months = Math.floor(diff_days / 30);
    let diff_years = Math.floor(diff_months / 12);
    
    let format_date = function (number) {
      return /^\d$/.test(number) ? '0' + number : number;
    };
    // 显示全部
    if (!type || type == 1) {
      return param_year + '-' + format_date(param_month) + '-' + format_date(param_day) + ' ' 
        + format_date(param_hours) + ':' + format_date(param_minutes) + ':' + format_date(param_seconds);
    }
    // 显示：01/01 01:01
    else if (type == 2) {
      return format_date(param_month) + '/' + format_date(param_day) + ' ' 
        + format_date(param_hours) + ':' + format_date(param_minutes);
    }
    // 只显示年月日
    else if (type == 3) {
      return param_year + '-' + format_date(param_month) + '-' + format_date(param_day)
    }
    // 只显示时分秒
    else if (type == 4) {
      return format_date(param_hours) + ':' + format_date(param_minutes) + ':' + format_date(param_seconds)
    }
    else if (type == 5) {
      return format_date(param_year) + '/' + format_date(param_month) + '/' + format_date(param_day)
    } 
    else if (type == 6) {
      if (diff_days === 0 & currdate_day === param_day) {
        if (diff_hours === 0) {
          if (diff_minutes > 0) {
            return diff_minutes + "分钟前"
          } else {
            diff_seconds === 0 ? (diff_seconds = 1) : diff_seconds
            return diff_seconds + "秒前"
          }
        } else {
          return diff_hours + "小时前"
        }
      } else if(currdate_day !== param_day & current_pre_date === param_day){
        return "昨天"
      } else {
        if (currdate_year === param_year) {
          return format_date(param_month) + '-' + format_date(param_day)
        } else {
          return param_year + '-' + format_date(param_month) + '-' + format_date(param_day)
        }
      }
    }
  },
	
  bugStatusName (data) {
    let status_list = BasicData.bug_status_list
    for (let x in status_list) {
      if (status_list[x]['status_value'] == data) {
        return status_list[x]['status_name']
      }
    }
  },
	
  getOperatorsName (data) {
    let list =  [
      {"value": "=","name":'='},
      {"value": "!=","name":'!='},
      {"value": ">=","name":'>='},
      {"value": "<=","name":'<='},
      {"value": ">","name":'>'},
      {"value": "<","name":'<'},
      {"value": "and","name":'and'},
      {"value": "or","name":"or"},
      {"value": "range","name":'范围'},
    ]
    for (let x in list) {
      if (list[x]['value'] == data) {
        return list[x]['name']
      }
    }
  },
	
  getSearchTypeName (data) {
    let list =  BasicData.bug_search_type_list
    for (let x in list) {
      if (list[x]['search_value'] == data) {
        return list[x]['search_name']
      }
    }
  },
	
  getOrderName (data) {
    let order_list = BasicData.order_list
    for (let x in order_list) {
      if (order_list[x]['order_value'] == data) {
        return order_list[x]['order_name']
      }
    }
  },
	
  QuickQperationName (data) {
    let QuickQperationList = BasicData.bug_quick_operation_list
    for (let x in QuickQperationList) {
      if (QuickQperationList[x]['quick_value'] == data) {
        return QuickQperationList[x]['quick_name']
      }
    }
  },
	
  flowdesc (type) {
    let data = [
      {'status': -1, 'name': '不涉及此项'},
      {'status': 0, 'name': '未开始'},
      {'status': 1, 'name': '设计中'},
      {'status': 2, 'name': '开发中'},
      {'status': 3, 'name': '开发完成'},
      {'status': 4, 'name': '待调试'},
      {'status': 5, 'name': '调试中'},
      {'status': 6, 'name': '调试'},
      {'status': 7, 'name': '进入测试'},
      {'status': 8, 'name': '测试中'},
      {'status': 9, 'name': '存在Bug'},
      {'status': 10, 'name': '修复Bug中'},
      {'status': 11, 'name': '回归Bug'},
      {'status': 12, 'name': '测试通过'},
      {'status': 13, 'name': '已上线'}
    ]
    for (let x in data) {
      if (data[x]['status'] == type) {
        return data[x]['name']
      }
    }
  },
	
  FilterCaseStatus (status_value) {
    let data = [
      { status_name: "正常", status_value: 0 },
      { status_name: "无效", status_value: 1 }
    ]
    for (let x in data) {
      if (data[x]['status_value'] == status_value) {
        return data[x]['status_name']
      }
    }
  }
}