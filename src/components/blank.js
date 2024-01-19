()=>{
    try{
        let x = appData.facilities.filter(item=>item.name===formData.ship_to_location)[0].address; 
        return x; 
    }catch(error){
        let x= ""; 
        return x;
    }
}

()=>{
    try{let x = appData.user.full_name;  
        return x}
    catch(error){
        let x = ""; return x;
    }
}

func =()=>{
    try{
      let total=0; formData.forEach(item=>{
        total=Number(total)+Number(item.amount);
      });
      return total;
    }catch(error){
        let x = formData.total_amount; 
        return x;
     }
  }; func();

  let func=()=>{
    const date1 = new Date(formData.order_date); 
    const date2 = new Date(formData.approved_date); 

    if(formData.approved_date){
        if(formData.approved_date >= formData.order_date){
            const daysDifference = Math.max(Math.floor((date2 - date1) / (24 *60*60*1000)),0); 
            return (daysDifference)
        }
    }
     else{return;}
    }; func();