// Settings //

Nav.events.open.settings = function(param){
    
    DB.connect.transaction(function(c){

        c.executeSql('SELECT * FROM sets',[],function(c,r){

            $('#settings .email .current-value')
                .html(r.rows.item(0).email)
                .attr('data-default',r.rows.item(0).email);

        },function(c,err){

            console.log(err);

        });

    });
    
    showPage('settings');
    
}

Nav.events.close.settings = function(param){
    
    var email = $('#settings #mail').prop('value');
    
    DB.connect.transaction(function(c){
        
        c.executeSql('UPDATE sets SET email=?',[email],function(c,r){
            
            console.log('update email ('+email+')');
            
        },function(c,err){
            
            console.log(err);
            
        });
        
    });
    
    hiddenPage();
    
}

// allStudy //

Nav.events.open.allStudy = function(p){
    
    $('[data-back]').css('display','none');
    $('header button.btn-left-menu').css('display','block');
    
    DB.connect.transaction(function(connect){

        connect.executeSql("SELECT * FROM study ORDER BY id DESC",[],function(connect,res){

            var html = '';
            
            if(res.rows.length > 0){
                
                $('#allStudy .no-res').css('display','none');
                
            }

            for(var i=0;i<res.rows.length;i++){

                html += '<div class="nav-btn" data-label-id="' + res.rows.item(i).id_group + '" data-context="show_cmdelstudy" data-page="showStats" data-param="' + res.rows.item(i).id + '">';
                
                html += '<div class="label-name"></div>';

                html += '<div class="name">' + res.rows.item(i).name;

                var dateOfStart = getFormatDate(res.rows.item(i).timestamp,'Y/M/D');

                html += '<span class="date-of-start">from ' + dateOfStart + '</span>';

                html += '</div>';

                html += '</div>';

            }

            $('#allStudy .container').html(html);
            
            addLabels();

            showPage('allStudy');

            $('#allStudy [data-new="study"]').attr('data-param',p);

            Funcs.init('#allStudy .container');

            Nav.initPages('#allStudy');
            
            addContextMenuEvent('#allStudy');
            
            navBtnWidth('#allStudy',' ');

        });

    });
    
}

Nav.events.close.allStudy = function(p){

    $('#allStudy .no-res').css('display','block');
    
    $('[data-back]').css('display','block');

    $('header button.btn-left-menu').css('display','none');

    $('#study .nav-btn[data-del]').css('display','none');

    hiddenPage();

}

// Add new group //

Nav.events.open.addnewgroup = function(param){

    showPage('addnewgroup');
    
    setTimeout(function(){
        
        $('#addnewgroup [for="groupName"]').click();
        
    },200);

}

Nav.events.close.addnewgroup = function(param){

    hiddenPage();

}

// STUDY //

Nav.events.open.study = function(param){
    
    $('header button.add').attr('data-param',param);
    
    // show .page-name
    
    DB.connect.transaction(function(c){
        
        c.executeSql("SELECT name FROM groups WHERE id=?",[param],function(c,res){
            
            $('#study .page-name').html(res.rows.item(0).name).attr('data-id',param);
            
        });
        
    })
    
    
    
    DB.connect.transaction(function(connect){

        connect.executeSql("SELECT * FROM study WHERE id_group=?",[param],function(connect,res){

//            console.log(res);

            var html = '';
            
            if(res.rows.length > 0){

                $('#study .no-res').css('display','none');

            }

            for(var i=0;i<res.rows.length;i++){

                html += '<div class="nav-btn" data-label-id="' + res.rows.item(i).id_group + '" data-context="show_cmdelstudy" data-page="showStats" data-param="' + res.rows.item(i).id + '">';

                html += '<div class="label-name"></div>';

                html += '<div class="name">' + res.rows.item(i).name;

                var dateOfStart = getFormatDate(res.rows.item(i).timestamp,'Y/M/D');

                html += '<span class="date-of-start">from ' + dateOfStart + '</span>';

                html += '</div>';

                html += '</div>';

            }

            $('#study .container').html(html);
            
            addLabels('#study');

            showPage('study');
            
            $('#study [data-new="study"]').attr('data-param',param);

            Funcs.init('#study .container');

            Nav.initPages('#study');
            
            addContextMenuEvent('#study');
            
            navBtnWidth('#study',' ');

        });

    });
    
}


Nav.events.close.study = function(param){

    $('#study .no-res').css('display','block');
    
    $('header button.add').attr('data-param','');
    
    Funcs.do.closeEditName('study');
    
    $('#study .nav-btn[data-del]').css('display','none');

    hiddenPage();

}

// Add new study //

Nav.events.open.addnewstudy = function(param){
    
    // param is id //

    showPage('addnewstudy');
    
    if(param != ''){
        
        $('#idLabel option[value="' + param + '"]').attr('selected','selected');
        
    }
    
    $('#addnewstudy [data-func="saveNewStudy"]').attr('data-param',param);

}


Nav.events.close.addnewstudy = function(param){

    hiddenPage();

}

// addStat //

Nav.events.open.addStat = function(param){
    
    setTimeout(function(){
        
        $('#addStat .form-group label',0).click();
        
    },100);
    
    DB.connect.transaction(function(connect){
        
        connect.executeSql("SELECT `name` FROM `study` WHERE `id`=?",[param],function(connect,res){
            
            $('#addStat .page-name small').html(res.rows.item(0).name);
            
        });
        
    });
    
    $('[data-func="saveStat"]').attr('data-param',param);
    
    showPage('addStat');
    
}

Nav.events.close.addStat = function(param){

    hiddenPage();

}


// showStats //

Nav.events.open.showStats = function(id_study){
    
    $('header button.add').attr('data-param',id_study).attr('data-page','addStat');
    
    graph.clear();
    
    DB.connect.transaction(function(c){
        
        c.executeSql("SELECT * FROM entry WHERE id_study=? ORDER BY timestamp DESC",[id_study],function(c,res){
            
            c.executeSql("SELECT name,unit FROM study WHERE id=?",[id_study],function(c,res){
                
                $("#showStats .page-name").html(res.rows.item(0).name).attr('data-id',id_study);
                
                $("#showStats .unit").html(res.rows.item(0).unit);
                
                showPage('showStats');
                
            });

            newGraph(res);
            
            showLastOneStat(res,'#showStats .last-container',id_study);
            
            
        }, function(c,err){
            
            console.log(err);
            
        });
        
    });
    
}

Nav.events.close.showStats = function(){
    
    $('header button.add').attr('data-page','addnewstudy');
    
    Funcs.do.closeEditName('showStats');
    
    $('#showStats .last-container').html('');
    
    hiddenPage();
    
}

Nav.events.open.entriesList = function(p){

    var data = new String(p).split('-');

    var start = data[0];

    var end = data[1];
    
    var id_study = data[2];
    
    var format = 'Y/M/D';
    
    var formatStart = getFormatDate(start,format);
    
    var formatEnd = getFormatDate(end,format);

    DB.connect.transaction(function(c){
        
        c.executeSql("SELECT name,unit FROM study WHERE id=?",[id_study], function(c,study){
            
            var pagename = study.rows.item(0).name + '<br><small>' + formatStart + ' - ' + formatEnd + '</small>';
            
            $('#entriesList .page-name').html(pagename);
            
            c.executeSql("SELECT * FROM entry WHERE id_study=? AND timestamp <= ? AND timestamp >= ? ORDER BY id DESC", [id_study,start,end], function(c,res){
                
                if(res.rows.length > 0){

                    $('#entriesList .no-res').css('display','none');

                }
                
                var str = getListEntries(res,study);
                
                $('#entriesList .enries-container').html(str);
                
                addContextMenuEvent('#entriesList .enries-container');
                
                Funcs.init('#entriesList .enries-container');
                
                addBlurToFormEntriesList('#entriesList .enries-container');
                
                addMaxLengthToInput('#entriesList .enries-container');
                
                showPage('entriesList');

            }, function(c,err){

                console.log(err);

            });
            
            
        }, function(c,err){
            
            console.log(err);
            
        });
        
    });

}

Nav.events.close.entriesList = function(p){

    $('#entriesList .no-res').css('display','block');
    
    hiddenPage();
    
}

Nav.events.open.labels = function(p){
    
    DB.connect.transaction(function(c){
        
        c.executeSql("SELECT * FROM groups",[],function(c,res){
            
            var html = '';
            
            if(res.rows.length != 0)
                $('#labels .no-res').css('display','none');
            
            for(var i=0;i<res.rows.length;i++){
                
                html += '<div class="form-group" data-context="show_cmlabels">';
                
                html += '<div class="form-wrap input">';
                
                html += '<span class="counter"></span>';
                
                html += '<input type="text" name="labelname" maxlength="12" placeholder="Label name" data-id="' + res.rows.item(i).id + '" value="' + res.rows.item(i).name + '">';
                
                html += '</div>';
                
                html += '<div class="current-value" data-func="showInput" data-default="' + res.rows.item(i).name + '">' + res.rows.item(i).name + '</div>';
                
                html += '</div>';                        
                
            }
            
            $('#labels .container').html(html);
            
            Funcs.init('#labels .container');
            
            addContextMenuEvent('#labels .container');
            
//            addMaxLengthToInput('#labels .container');
            
            addBlurToFormLabels('#labels .container');
            
            showPage('labels');
            
        },function(c,err){
            
            console.log(err);
            
        });
        
    });
    
}

Nav.events.close.labels = function(p){
    
    $('#labels .no-res').css('display','block');

    hiddenPage();

}











