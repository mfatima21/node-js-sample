  /**
   * @function constructFilter
   * @param timeRange
   * @param startDate
   * @param endDate
   */

export const constructFilter = function(timeRange: any, startDate = "", endDate = "") {
  let where = {}
  const currentDate = new Date()
  const pastDate = timeRange == "weely" ? currentDate.getDate() - 7 : currentDate.getDate() - 30;
  
  if (timeRange == "daily") {
    let startOfDay = new Date();
    startOfDay.setUTCHours(0,0,0,0);

    let endOfDay = new Date();
    endOfDay.setUTCHours(23,59,59,999);
    where = { 
      viewDate: {
        $gte: startOfDay.toISOString(),
        $lt: endOfDay.toISOString()
      }
    }
  } else if (timeRange == "weekly") {
    where = {
      viewDate: {
        $gte: new Date(currentDate.setDate(pastDate)).toISOString(),
        $lte: new Date().toISOString()
      }
    }
  } else if (timeRange == "monthly") {
    where = {
      viewDate: {
        $gte: new Date(currentDate.setDate(pastDate)).toISOString(),
        $lte: new Date().toISOString()
      }
    }
  } else if(timeRange == "custom") {
    where = {
      viewDate: {
        $gte: new Date(startDate).toISOString(),
        $lt: new Date(endDate).toISOString()
      }
    }
  }
  return where;
}

export  const formatResponse = function(userViews: any, users: any) {
  let usersHashMap: any = usersMap(users)
  const res = userViews.map((u: any) => ({ userId: u.userId, user: usersHashMap[u.userId] }))
  return res;
}

const usersMap = function(users: any) {
  const map: any = {}
  users.forEach((user: any) => {
    if (!map[user.id]) {
      map[user.id] = user
    }
  })
  return map;
}