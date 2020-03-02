
export default {
  transformData(obj: any) {
      var params = new FormData();
      Object.keys(obj).forEach(item=>{
          params.append(item, obj[item])
      })
      return params;
  }
}