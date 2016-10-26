var graph = {};

$(window).bind("mobileinit", function() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});

$(document).ready(function(){
    
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
    
    $.get('http://anystats.wection.in.ua/',function(data){
      
        console.log(data);
        
    })
    
    plugin_fb.callback = function(param){

        $.getJSON('https://graph.facebook.com/me/?access_token='+param['access_token'],function(data){

            console.log(data);
            
            $getJSON('https://graph.facebook.com/v2.8/' + data.id + '/picture/?height=300&width=300&redirect=false&access_token='+param['access_token'],function(d){
                
                console.log(d);
                
            });

        });

    }
    
    
});
