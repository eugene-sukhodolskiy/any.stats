// Settings //

Nav.events.open.settings = function(param){
    
    $('#settings').css('display','block');
    
}

Nav.events.close.settings = function(param){
    
    Nav.hiddenAll();
    
}

// Groups //

Nav.events.open.groups = function(param){
    
    $('[data-back]').css('display','none');
    
    
    DB.connect.transaction(function(connect){
       
        connect.executeSql("SELECT * FROM groups",[],function(connect,res){
            
            console.log(res);
            
            var html = '';
            
            for(var i=0;i<res.rows.length;i++){
                
                html += '<div class="nav-btn" data-id="' + res.rows.item(i).id + '">';
                
                html += '<button class="nav-btn-del" data-func="delGroup" data-param="' + res.rows.item(i).id + '">+</button>';

                html += '<div class="name">' + res.rows.item(i).name + '</div>';

                html += '</div>';
                
            }
            
            $('#groups .container').html(html);
            
            $('#groups').css({'display': 'block'});
            
            Funcs.init('#groups .container');
            
            Nav.init();
            
        });
        
    });
    
}

Nav.events.close.groups = function(param){
    
    $('[data-back]').css('display','block');
    
    Nav.hiddenAll();
    
}

// Add new group //

Nav.events.open.addnewgroup = function(param){

    $('#addnewgroup').css({'display': 'block'});

}

Nav.events.close.addnewgroup = function(param){

    Nav.hiddenAll();

}