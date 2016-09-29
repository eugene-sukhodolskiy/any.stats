// Settings //

Nav.events.open.settings = function(param){
    
    showPage('settings');
    
}

Nav.events.close.settings = function(param){
    
    hiddenPage();
    
}

// Groups //

Nav.events.open.groups = function(param){
    
    $('[data-back]').css('display','none');
    
    
    DB.connect.transaction(function(connect){
       
        connect.executeSql("SELECT * FROM groups",[],function(connect,res){
            
//            console.log(res);
            
            var html = '';
            
            for(var i=0;i<res.rows.length;i++){
                
                html += '<div class="nav-btn" data-page="study" data-param="' + res.rows.item(i).id + '">';
                
                html += '<button class="nav-btn-del" data-func="delGroup" data-param="' + res.rows.item(i).id + '">+</button>';

                html += '<div class="name">' + res.rows.item(i).name + '</div>';

                html += '</div>';
                
            }
            
            $('#groups .container').html(html);
            
            showPage('groups');
            
            Funcs.init('#groups .container');
            
            Nav.initPages('#groups');
            
        });
        
    });
    
}

Nav.events.close.groups = function(param){
    
    $('[data-back]').css('display','block');
    
    hiddenPage();
    
}

// Add new group //

Nav.events.open.addnewgroup = function(param){

    showPage('addnewgroup');

}

Nav.events.close.addnewgroup = function(param){

    hiddenPage();

}

// STUDY //

Nav.events.open.study = function(param){
    
    DB.connect.transaction(function(connect){

        connect.executeSql("SELECT * FROM study WHERE id_group=?",[param],function(connect,res){

//            console.log(res);

            var html = '';

            for(var i=0;i<res.rows.length;i++){

                html += '<div class="nav-btn" data-page="stats" data-param="' + res.rows.item(i).id + '">';

                html += '<button class="nav-btn-del" data-func="delStudy" data-param="' + res.rows.item(i).id + '">+</button>';

                html += '<div class="name">' + res.rows.item(i).name + '</div>';

                html += '</div>';

            }

            $('#study .container').html(html);

            showPage('study');
            
            $('#study [data-new="study"]').attr('data-param',param);

            Funcs.init('#study .container');

            Nav.initPages('#study');

        });

    });
    
}


Nav.events.close.study = function(param){

    hiddenPage();

}

// Add new study //

Nav.events.open.addnewstudy = function(param){
    
    // param is id //

    showPage('addnewstudy');
    
    $('#addnewstudy [data-func="saveNewStudy"]').attr('data-param',param);

}


Nav.events.close.addnewstudy = function(param){

    hiddenPage();

}










