var graph = {};

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
    
    $('.popup-backgroud').bind('swipeleft',function(){

        Funcs.do.hidMenu();

    });
    
});
