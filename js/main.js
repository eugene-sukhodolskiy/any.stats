var graph = {};

$(document).ready(function(){
    
    DB.open("Test5","0.1",9000000);
    DB.createTables(tables);
    
    Nav.begin.page = 'groups';
    
    Nav.begin.param = 'group list';
    
    Nav.init();
    
    Funcs.init();
    
    inpFocus();
    
    graph = getGraph({"canvas": 'main-canvas',"size": 10});
    
    $('#showStats select[name="period"]').change(function(){
        
        Nav.reload();
        
    });
    
    addBlurToFormGroup();
    
    addMaxLengthToInput();
    
});
