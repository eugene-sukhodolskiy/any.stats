// DATABASE

var DB = {
    
    connect: null,
    
    errs: [],
    
    failedConnect: function(){
        console.log("FAILED CONNECT!");
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
            
            this.connect.transaction(funcs[i]);
            
        }
        
    }
    
    
    
}


var tables = [
    
    // Groups
    
    function(connect){
        
        connect.executeSql("CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY ASC, name TEXT, timestamp REAL)",[],function(c,res){
            
            c.executeSql('SELECT COUNT(*) FROM groups',[],function(c,res){
                
                if(res.rows.item(0)['COUNT(*)'] == 0){
                    
                    c.executeSql('INSERT INTO groups(name,timestamp) VALUES (?,?)',['Default',new Date().getTime()],null,function(c,err){

                        console.log(err);

                    });
                    
                }
                
            });
            
          
                
        },function(connect,err){
            
            console.log(err);
            
            DB.errs[DB.errs.length] = err;
            
        });
        
    },
    
    // Units
    
    function(connect){

        connect.executeSql("CREATE TABLE IF NOT EXISTS entry (id INTEGER PRIMARY KEY ASC, id_study REAL, timestamp REAL, value REAL)",[],null,function(connect,err){

            DB.errs[DB.errs.length] = err;

        });

    },
    
    function(connect){

        connect.executeSql("CREATE TABLE IF NOT EXISTS study (id INTEGER PRIMARY KEY ASC, id_group REAL, timestamp REAL, name TEXT, unit TEXT, telegramNotif REAL, emailNotif REAL, repiodicityNotif REAL)",[],null,function(connect,err){

            DB.errs[DB.errs.length] = err;

        });

    },
    
    function(connect){

        connect.executeSql("CREATE TABLE IF NOT EXISTS sets (id INTEGER PRIMARY KEY ASC, email TEXT, uname TEXT, lastsync REAL)",[],function(c,res){
            
            c.executeSql('SELECT COUNT(*) FROM sets',[],function(c,res){

                if(res.rows.item(0)['COUNT(*)'] == 0){
            
                    c.executeSql('INSERT INTO sets(email) VALUES (?)',['Empty']);
                    
                }
                
            });
            
        },function(connect,err){

            DB.errs[DB.errs.length] = err;

        });

    }
    
    
];









