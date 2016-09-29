var Funcs = {
    
    do: {},
    
    init: function(path){
        
        path = path || '';
        
        $(path+' [data-func]').click(function(){
            
            var funcname = $(this).attr('data-func');
            
            var param = $(this).attr('data-param');
            
            Funcs.do[funcname](param);
            
        });
        
    }
    
}


Funcs.do.saveNewGroup = function(param){
    
    console.log('hell');
    
    var name = $('#groupName').prop('value');
    
    $('#groupName').prop('value','');

    DB.connect.transaction(function(connect){
        
        connect.executeSql("INSERT INTO groups (id,name,timestamp) VALUES (NULL,?,?)",[name,Date.now()], function(res){
            
            Nav.back();
            
        },function(connect,err){
            
            console.log(err);
            
        });
        
    });
    
}

Funcs.do.delGroup = function(id){
    
    DB.connect.transaction(function(connect){

        connect.executeSql("DELETE FROM groups WHERE id=?",[id], function(res){

            Nav.reload();

        });

    });
    
}

Funcs.do.delStudy = function(id){
    
    DB.connect.transaction(function(connect){

        connect.executeSql("DELETE FROM study WHERE id=?",[id], function(res){

            Nav.reload();

        });

    });
    
}

function showPage(page){
    
    $('#' + page).css({'display': 'block'});
    
    setTimeout(function(){ 
        
        $('#' + page).css('opacity', 1);
        
    },10);
    
}

function hiddenPage(){
    
    $('.page').css({'opacity': 0});
    
    Nav.hiddenAll();
    
}






