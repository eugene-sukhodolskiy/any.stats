var Sync = {
    
    host: 'http://anystats.wection.in.ua',
    
    tables: [
        
        'study',
        'entry',
        'groups'
        
    ],
    
    start: function(){
    
        for(var i=0;i<this.tables.length;i++){
            
            DB.q('SELECT timestamp FROM ' + this.tables[i] + ' ORDER BY id DESC LIMIT 1',[],function(c,res){
                
                
                
            },function(c,err){
                console.log(err);
            })
                 
        }
    
    }
    
}