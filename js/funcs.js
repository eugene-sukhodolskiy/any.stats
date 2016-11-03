var Funcs = {
    
    do: {},
    
    init: function(path){
        
        path = path || '';
        
        $(path + ' [data-func]').click(function(){
            
            if($(this).attr('data-taphold') == 1){
                
                $(this).removeAttr('data-taphold');
                
                return false;
                
            }
            
            var funcname = $(this).attr('data-func');
            
            var param = $(this).attr('data-param');
            
            Funcs.do[funcname](param,this);
            
        });
        
    }
    
}


Funcs.do.saveNewGroup = function(param){
        
    var name = $('#groupName').prop('value');
    
    if(name == ''){
        
        $('#groupName').parent().parent().addClass('warning');
        
        return false;
        
    }
    
    $('#groupName').prop('value','');

    DB.connect.transaction(function(connect){
        
        connect.executeSql("INSERT INTO groups (id,name,timestamp) VALUES (NULL,?,?)",[name,new Date().getTime()], function(res){
            
            Nav.back();
            
            updateLabelList();
            
            initLabelListOnNewStudy();
            
            
        },function(connect,err){
            
            console.log(err);
            
        });
        
    });
    
}

Funcs.do.delGroup = function(id){
    
    DB.connect.transaction(function(connect){

        connect.executeSql("SELECT id FROM study WHERE id_group=?",[id], function(c,res){
            
            for(var i=0;i<res.rows.length;i++){
                
                studyDelFromDB(res.rows.item(i).id);
                
            }
            
            
            c.executeSql("DELETE FROM groups WHERE id=?",[id],function(c,res){
                
                delFromHTML(id,'#groups');
                
            });

        }, function(c,err){
            
            console.log(err);
            
        });

    });
    
}

Funcs.do.delStudy = function(id,t){
    
    studyDelFromDB(id);
    
    delFromHTML(id,'#' + Nav.currentPage);
    
    hid_cmdown();
    
}

Funcs.do.saveNewStudy = function(id){
    
    var name = $('#studyName').prop('value');
    
    var unit = $('#studyUnit').prop('value');
    
    var telegramNotif = ($('#telegramNotif').prop('checked')) ? 1 : 0;

    var emailNotif = ($('#emailNotif').prop('checked')) ? 1 : 0;
    
    var period = $('#periodicity').prop('value');
    
    var id_group = $('#idLabel').prop('value');
    
    if(name == ''){
        
        $('#studyName').parent().parent().addClass('warning'); 
        
        return false;
        
    }
    
    if(unit == ''){

        $('#studyUnit').parent().parent().addClass('warning'); 
        
        return false;

    }
    
    DB.connect.transaction(function(connect){
        
        connect.executeSql('INSERT INTO study (id_group,name,unit,telegramNotif,emailNotif,repiodicityNotif,timestamp) VALUES (?,?,?,?,?,?,?)',[id_group,name,unit,telegramNotif,emailNotif,period,new Date().getTime()],function(connect,res){
            
            Nav.back();
            
        },function(connect,err){
            
            console.log(err);
            
        });
        
    });
    
    
}

Funcs.do.saveStat = function(id){
    
    var amount = parseInt($('#amount').prop('value'));
    
    if(isNaN(amount)){
        
        $('#amount').parent().parent().addClass('warning'); 
        
        return false;
        
    }
    
    DB.connect.transaction(function(connect){
        
        connect.executeSql("INSERT INTO entry (value,id_study,timestamp) VALUES (?,?,?)",[amount,id,new Date().getTime()], function(connect, res){
            
            Nav.back();
            
        }, function(connect, err){
            
            console.log(err);
            
        });
        
    });
    
}

Funcs.do.openEditName = function(page){
    
    var p = $('#' + page + ' .form-edit');
    
    $(p).css({'display': 'block'}).attr('data-backmark',page);
    
    var val = $('#' + page ).find('.page-name').html();
    
    $(p).find('input',0).prop('value',val).prop('selectionStart',val.length).focus();
    
    setTimeout(function(){
        
        $(p).css({
            
            'opacity': 1,
            'height': '100%'
            
        });
        
    },1);
    
    Nav.addTmpBack(function(){
        
        Funcs.do.closeEditName($('.form-edit[data-backmark]').attr('data-backmark'));
        
    });
    
}

Funcs.do.closeEditName = function(page){
    
    Nav.removeTmpBack();

    var p = $('#' + page + ' .form-edit');
    
    $(p).css({

        'opacity': 0,
        'height': '10%'

    }).removeAttr('data-backmark').find('input',0).prop('value','').attr('value','');

    setTimeout(function(){
        
        $(p).css({'display': 'none'});

    },200);

}

Funcs.do.saveEditName = function(page){
    
    var inp = $('#' + page + ' .form-edit').find('input');
    
    var val = $(inp).prop('value');
    
    if(val == ''){
        
//        $(inp).parent().css('background-color', '#C62828');
//        
//        setTimeout(function(){
//            
//            $(inp).parent().css('background-color', '#1976D2');
//            
//        },2000);
        
        
    } else {
        
        var path = '#' + page + ' .page-name';
        
        $(path).html($(inp).attr('value'));
        
        setTimeout(function(){
            $(path).html(val);
        },10);
        
        var tabname = {
            
            'study': 'groups',
            'showStats': 'study'
            
        }
        
        var id = $(path).attr('data-id');
        
        DB.connect.transaction(function(c){
            
            c.executeSql("UPDATE " + tabname[page] + " SET name=? WHERE id=?",[val,id],function(c,res){
                
                $('.left-menu .group-list [data-param="' + id + '"]',0).html(val);
                
            },function(c,err){
                
                console.log(err);
                
            });
            
        });
    
        Funcs.do.closeEditName(page);
        
    }
    
}


Funcs.do.showInput = function(p,t){
    
    showInput(t);

}

Funcs.do.checkOn = function(p,t){
    
    checkOn(p,t);
    
}

Funcs.do.openSelect = function(p,t){
    
    
    
}

Funcs.do.reload = function(p){
    
    reloadGraph();
    
}

Funcs.do.showMenu = function(p){
    
    showLeftMenu();
    
}

Funcs.do.hidMenu = function(p){
    
    hidLeftMenu();
    
}

Funcs.do.hidBackground = function(){
    
    hidLeftMenu();
    
    hid_cmdown();
    
}

Funcs.do.delEntry = function(p,t){
    
    DB.connect.transaction(function(c){
        
        c.executeSql('DELETE FROM entry WHERE id=?',[p],function(c,res){
            
           var el = $('#' + Nav.currentPage + ' input[data-id="' + p + '"]',0).parent().parent();
            
            el.css('opacity',0);
            
            setTimeout(function(){
                
                el.css('display','none');
                
                reloadGraph();
                
                if(Nav.currentPage == 'entriesList' && $('#entriesList .one-stat:visible').length == 0){
                    
                    $('#entriesList .no-res').css('display','block');
                    
                }
                
            },200);
            
        });
        
    });
    
    hid_cmdown();
    
}

Funcs.do['_showInput'] = function(p){
    
    hid_cmdown();

    var el = $('#' + Nav.currentPage + ' [data-id="' + p + '"]',0).parent().parent().find('.current-value',0);

    showInput(el);

}

Funcs.do.share = function(param){
//    
    ctx = document.getElementById('main-canvas');
    var base64 = ctx.toDataURL("image/jpeg");
    
    var name = $('#showStats h1.pagename').html();

    setTimeout(function(){
        
        navigator.share(base64,'Share ' + name,'data:image/jpeg;base64');
//        window.plugins.socialsharing.share(null, name, base64, null);
        
    },200);
    
    
    
    
}

Funcs.do.login_ = function(){

    window.plugins.googleplus.login(
        {
            'webClientId': 'AIzaSyAnE8SwfVOGzyGoogCxEFfE6ereelX7riQ',
            'offline': true,
        },
        function (obj) {
            console.log(JSON.stringify(obj));
        },
        function (msg) {
            console.log('error: ' + msg);
        }
    );
    
}

Funcs.do.login = function(p){
    
//    facebookConnectPlugin.login([], function(data){
//        
//        console.log(data);
//        
//    }, function(err){
//        
//        console.log(err);
//        
//    })
    
//    var ref = cordova.InAppBrowser.open('https://www.facebook.com/v2.8/dialog/oauth?client_id=1795033897377699&redirect_uri=https://www.facebook.com/connect/login_success.html', '_blank', 'location=yes');
    
    if(p == 'facebook'){
    
        plugin_fb.auth(1795033897377699);
        
    }else if(p == 'google'){
        
        
        
    }
    
    
}

Funcs.do.delLabel = function(id_label){
    
    hid_cmdown();
    
    if(id_label == 1) return false;
    
    DB.connect.transaction(function(c){
       
        c.executeSql('DELETE FROM groups WHERE id=?',[id_label],function(c,res){
            
            c.executeSql('UPDATE study SET id_group=1 WHERE id_group=?',[id_label],function(c,res){
                
                $('.left-menu .group-list .label-style[data-param="' + id_label + '"]').css('display','none');
                
                var el = $('#labels .container [data-id="' + id_label + '"]').parent().parent();
                
                $(el).css('opacity',0);
                
                setTimeout(function(){
                    
                    $(el).css('display','none');
                    
                },200);
                
            },function(c,err){
                
                console.log(err);
                
            });
            
        },function(c,err){
            
            console.log(err);
            
        });
        
    });
    
}












