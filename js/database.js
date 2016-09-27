// DATABASE

var DB = {
    
    connect: null,
    
    errs: [],
    
    failedConnect: function(){
        Console.log("FAILED CONNECT!");
    },
    
    open: function(name,ver,size){
        
        this.connect = openDatabase(name,name,ver,size);
        
        if(!this.connect){
            
            this.failedConnect();
            
        }
        
        return true;
        
    },
    
    createTables: function(funcs){
        
        for(var i=0;i<funcs.length;i++){
            
            funcs[i](this.connect);
            
        }
        
    }
    
    
    
}

DB.open("Name","0.1",9000000);
//DB.createTables();


var tables = [
    
    // Groups
    
    function(connect){
        
        connect.executeSql("CREATE TABLE groups (id REAL UNIQUE, name TEXT, timestamp REAL)",[],null,function(connect,err){
            
            DB.errs[DB.errs.length] = err;
            
        });
        
    },
    
    // Units
    
    function(connect){

        connect.executeSql("CREATE TABLE units (id REAL UNIQUE, name TEXT, timestamp REAL, id_group REAL)",[],null,function(connect,err){

            DB.errs[DB.errs.length] = err;

        });

    },
    
    function(connect){

        connect.executeSql("CREATE TABLE entries (id REAL UNIQUE, id_unit REAL, timestamp REAL, value REAL )",[],null,function(connect,err){

            DB.errs[DB.errs.length] = err;

        });

    },
    
    function(connect){

        connect.executeSql("CREATE TABLE settings (id REAL UNIQUE, name, timestamp REAL, value REAL )",[],null,function(connect,err){

            DB.errs[DB.errs.length] = err;

        });

    }
    
    
];









