export const createParetoData = (data,category, aggregation_type,field_to_aggregate)=>{
  
    //calculate totals and running totals
      let sortedData = data.map(item=>{
      return item
    }).sort((a,b) => (a.value > b.value ? -1 : 1))
      
      let total = 0
      sortedData.map(item=>{
        total= total + parseFloat(item.value)
      })
      
     // Additional fields needed for pareto chart
      var updated_data =[]
      var running_total = 0
      sortedData.forEach((item)=>{
        var value = parseFloat(item.value)
        var pct_of_total = parseFloat((100*value / total).toFixed(2))
        running_total = parseFloat((running_total + parseFloat(item.value)).toFixed(0))
        var running_pct_of_total = parseFloat((100*running_total / total).toFixed(2))
        var new_data = {value, pct_of_total, running_total,running_pct_of_total}
        var updated_item = {...item,...new_data}
        updated_data.push(updated_item)
      })
    
    //get labels
    const labels = updated_data.map(item=>{
      return item['label']
    })
    
    //get item values
    const item_values = updated_data.map(item=>{
      return item['value']
    })
    
    //get pct running total values
    const pct_running_total_values = updated_data.map(item=>{
      return item['running_pct_of_total']
    })
    
    return {updated_data, labels,item_values,pct_running_total_values}
   }