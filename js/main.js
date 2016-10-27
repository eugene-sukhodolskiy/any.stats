var graph = {};

$(window).bind("mobileinit", function() {
    
    $.support.cors = true;
    
    $.mobile.allowCrossDomainPages = true;
    
});

$(document).ready(function(){
    
    plugin_fb.callback = function(param){

        $.getJSON('https://graph.facebook.com/me/?access_token='+param['access_token'],function(data){

            console.log(data);

            DB.connect.transaction(function(c){

                c.executeSql("UPDATE user SET uid=?, uname=?",[data.id,data.name],function(){},function(c,err){

                    console.log(err);

                });

            });

            $.getJSON('https://graph.facebook.com/v2.8/' + data.id + '/picture/?height=300&width=300&redirect=false&access_token='+param['access_token'],function(d){

                var img = document.createElement("img");

                img.src = d.data.url;

                img.onload = function() {

                    canvas = document.createElement("canvas");

                    canvas.width = img.width;  

                    canvas.height = img.height;  

                    var ctx = canvas.getContext("2d");  

                    ctx.drawImage(img, 0, 0);

                    var img_base64 = canvas.toDataURL("image/jpeg");

                    DB.connect.transaction(function(c){

                        c.executeSql('UPDATE user SET picture=?, picture_url=?',[img_base64,img.src],function(c,res){
                            
                            initProfile();
                            
                            loginScreenHidden();
                            
                        },function(c,err){

                            console.log(err);

                        });

                    });

                }

            });

        });

    }
    
    
    
    document.body.onselectstart = function() {return false}
    
    DB.open("Test5","0.1",9000000);
    DB.createTables(tables);
    
    Nav.begin.page = 'allStudy';
    
    Nav.begin.param = 'allStudy list';
    
    Nav.init();
    
    Funcs.init();
    
    inpFocus();
    
    graph = getGraph({"canvas": 'main-canvas',"size": 10});
    
    $('#showStats select[name="period"]').change(function(){
        
        Nav.reload();
        
    });
    
    addBlurToFormGroup();
    
    addMaxLengthToInput();
    
    $.getJSON('sys.json',function(d){
        
        $('#settings .ver').html(d.ver);
        
    });
    
    initLeftMenu();
    
    initLabelListOnNewStudy();
    
    $('.menu-left-swipe').bind('swiperight',function(){
        
        Funcs.do.showMenu();
        
    });
    
    $('.left-menu').bind('swipeleft',function(){

        Funcs.do.hidMenu();

    });
    
    $('.popup-background').bind('swipeleft',function(){

        Funcs.do.hidMenu();

    });
    
    profileCheck();
    
    
});
