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

// Groups //

Nav.events.open.groups = function(param){
    
    $('[data-back]').css('display','none');
    $('header button.btn-left-menu').css('display','block');
    
    
    DB.connect.transaction(function(connect){
       
        connect.executeSql("SELECT * FROM groups",[],function(connect,res){
            
//            console.log(res);
            
            var html = '';
            
            if(res.rows.length != 0){
                
                $('#groups .nav-btn[data-del]').css('display','inline-block');
                
            }
            
            for(var i=0;i<res.rows.length;i++){
                
                html += '<div class="nav-btn" data-page="study" data-param="' + res.rows.item(i).id + '">';
                
                html += '<div class="no-click"></div>';
                
                html += '<button class="nav-btn-del" data-func="sQuestionDelGroups" data-param="' + res.rows.item(i).id + '"></button>';
                
                html += '<div class="askDel"><button data-func="delGroup" data-param="' + res.rows.item(i).id + '" class="yes"></button> <button data-func="hQuestionDelGroups" data-param="true" class="no"></button>';
                
                html += '<span>Delete?</span></div>';

                html += '<div class="name">' + res.rows.item(i).name + ' <span class="count"></span>';
                
                

                html += '</div></div> ';
                
            }
            
            $('#groups .container').html(html);
                
            getCount(res);

            
            showPage('groups');
            
            Funcs.init('#groups .container');
            
            Nav.initPages('#groups');
            
        });
        
    });
    
}



Nav.events.close.groups = function(param){
    
    $('[data-back]').css('display','block');
    
    $('header button.btn-left-menu').css('display','none');
    
    $('#groups .nav-btn[data-del]').css('display','none');
    
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
            
            if(res.rows.length != 0){

                $('#study .nav-btn[data-del]').css('display','inline-block');
                
            }

            for(var i=0;i<res.rows.length;i++){

                html += '<div class="nav-btn" data-page="showStats" data-param="' + res.rows.item(i).id + '">';
                
                html += '<div class="no-click"></div>';
                
                html += '<button class="nav-btn-del" data-func="sQuestionDelStudy" data-param="' + res.rows.item(i).id + '"></button>';

                html += '<div class="askDel"><button data-func="delStudy" data-param="' + res.rows.item(i).id + '" class="yes"></button> <button data-func="hQuestionDelStudy" data-param="true" class="no"></button>';

                html += '<span>Delete?</span></div>';

                html += '<div class="name">' + res.rows.item(i).name;
                
                var dateOfStart = getFormatDate(res.rows.item(i).timestamp,'Y/M/D');
                
                html += '<span class="date-of-start">from ' + dateOfStart + '</span>';
                
                html += '</div>';

                html += '</div> ';

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
    
    Funcs.do.closeEditName('study');
    
    $('#study .nav-btn[data-del]').css('display','none');

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

// addStat //

Nav.events.open.addStat = function(param){
    
    DB.connect.transaction(function(connect){
        
        connect.executeSql("SELECT `name` FROM `study` WHERE `id`=?",[param],function(connect,res){
            $('#addStat .page-name small').html('"'+res.rows.item(0).name+'"');
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
    
    $('[data-page="addStat"]').attr('data-param',id_study);
    
    graph.clear();
    
    DB.connect.transaction(function(c){
        
        c.executeSql("SELECT * FROM entry WHERE id_study=? ORDER BY timestamp DESC",[id_study],function(c,res){
            
            c.executeSql("SELECT name,unit FROM study WHERE id=?",[id_study],function(c,res){
                
                $("#showStats .page-name").html(res.rows.item(0).name).attr('data-id',id_study);
                
                $("#showStats .unit").html(res.rows.item(0).unit);
                
                showPage('showStats');
                
            });

            var points = [];
            
            var ft;
            
            var sum = 0;
            
            var time = parseInt($('#showStats select[name="period"]').prop('value'));
            
            var flag = 1;
            
            var n = 1;
            
            var check = $('#average').prop('checked');
            
            var c = 0;
            
            var timebtns = {
                
                start: [],
                
                end: [],
                
                format: []
                
            };
            
            for(var i=0;i<res.rows.length;i++){
                
                flag = 0;
                
                if(sum == 0){
                    
                    sum = res.rows.item(i).value;
                    
                    ft = res.rows.item(i).timestamp;
                    
                    c++;
                    
                    continue;
                    
                }
                
                if(ft - res.rows.item(i).timestamp <= time){
                    
                    sum += res.rows.item(i).value;
                    
                    c++;
                    
                }else{
                    
                    if(check == true)
                        sum = sum / c;
                    
                    c = 1;
                    
                    var p = [n++, sum, ft];
                    
                    points[points.length] = p;
                    
                    timebtns.start[timebtns.start.length] = ft;

                    timebtns.end[timebtns.end.length] = res.rows.item(i - 1).timestamp;
                    
                    sum = res.rows.item(i).value;
                    
                    ft = res.rows.item(i).timestamp;
                    
                    flag = 1;
                    
                }
                
            }
            
            if(flag == 0){
                
                if(check == true)
                    sum = sum / c;
                
                c = 0;
                
                var p = [n, sum, ft];

                points[points.length] = p;
                
                timebtns.start[timebtns.start.length] = ft;

                timebtns.end[timebtns.end.length] = res.rows.item(i - 1).timestamp;
                
            }
            
//            console.log(points);
            
            var max = 0;
            
            var formatDate = getFormatFromPeriod(time);
            
            for(var i=0;i<points.length;i++){
                
                if(points[i][1] > max)
                    max = points[i][1];
                
                var time = getFormatDate(points[i][2],formatDate);
                
                points[i][3] = time;
                
                timebtns.format[timebtns.format.length] = time;
                
            }
            
            var height = parseInt($('#main-canvas').attr('height'));
            
            
//            console.log(max);
            
            graph.sizeY = (height - height / 4) / max;
            
            if(points.length == 0){
                
                showNoRes();
                
            }else{
                
                hidNoRes();
                
            }
            
            graph.set([points]);
            
            graph.draw();
            
            genTimeBtn(timebtns,'#showStats .time-btn-container');
            
            $('#showStats .time-btn-container').css('width',$('#main-canvas').css('width'));
            
            showLastOneStat(res,'#showStats .last-container',id_study);
            
            
        }, function(c,err){
            
            console.log(err);
            
        });
        
    });
    
}

Nav.events.close.showStats = function(){
    
    Funcs.do.closeEditName('showStats');
    
    $('#showStats .last-container').html('');
    
    hiddenPage();
    
}

Nav.events.open.goToEntries = function(p){

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
                
                var str = getListEntries(res,study);
                
                $('#entriesList .enries-container').html(str);
                
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

Nav.events.close.goToEntries = function(p){
    
    hiddenPage();
    
}










