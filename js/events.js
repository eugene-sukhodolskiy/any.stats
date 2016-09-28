Nav.events.open.settings = function(param){
    
    $('#settings').css('display','block');
    
}

Nav.events.close.settings = function(param){
    
    Nav.hiddenAll();
    
}

Nav.events.open.groups = function(param){
    
    $('#groups').css({'display': 'block'});
    
}

Nav.events.close.groups = function(param){
    
    Nav.hiddenAll();
    
}