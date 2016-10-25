function getGraph(param){

    param.size = param.size || 20;

    var ret = {

        canvas: param.canvas,

        data: [],

        sizeY: param.size,
        
        sizeX: 220,

        colors: ['red','blue','green','grey','orange','black'],

        set: function(content){

            this.data = content;
            
            var w = this.sizeX * this.data[0].length + 200;
            
            if(w < 800) w = 800;
            
            $('#' + this.canvas).attr('width',w).css('width',(w / 2) + 'px');
            

        },
        
        clear: function(){
            
            var height = parseInt($('#'+this.canvas).attr('height'));
            
            var width = parseInt($('#'+this.canvas).attr('width'));
            
            ctx = document.getElementById(this.canvas);
            
            ctx = ctx.getContext('2d');
            
            ctx.fillStyle = 'white';
            
            ctx.fillRect(0,0,width,height);
             
            
        },

        draw: function(){
            
            var n = 0;
            
            var ctx = [];

//            for(var n=0;n<this.data.length;n++){

                ctx[n] = document.getElementById(this.canvas);

                var height = parseInt($('#'+this.canvas).attr('height'));
                
                var width = parseInt($('#'+this.canvas).attr('width'));
                
                ctx[n] = ctx[n].getContext('2d');
                
            
                
                ctx[n].font = 'normal 22px sans-serif';
                

                for(var i=0;i<this.data[n].length;i++){

                    var x = parseInt(this.data[n][i][0] * this.sizeX);

                    var y = parseInt(this.data[n][i][1] * this.sizeY  + 70);

                    y = height - y;

//                    console.log(x+':'+y);
                    
                    ctx[n].strokeStyle = this.colors[n];

                    ctx[n].fillStyle = this.colors[n];

                    if(i)
                        ctx[n].lineTo(x,y);
                    else
                        ctx[n].moveTo(x,y);

                    ctx[n].fillRect(x-6,y-6,12,12);
                    
                    
                    // value
                    
                    ctx[n].fillText(this.data[n][i][1], x - 12, y - 20);
                    
                    // mark
                    
                    ctx[n].fillStyle = 'black';
                    
                    ctx[n].fillText("'", x-2, height - 40);
                    
                    
                    // date
                    
//                    ctx[n].fillStyle = 'black';
//                    
//                    ctx[n].fillText(this.data[n][i][3], x - 70, height - 20);
//                    
//                    
//                    ctx[n].fillStyle = this.colors[n];
                    
                    
                    
                    // percent
                    
                    if(i != this.data[n].length - 1){
                        
                        var x2 = parseInt(this.data[n][i+1][0] * this.sizeX);

                        var y2 = parseInt(this.data[n][i+1][1] * this.sizeY + 20);
                        
                        var small = (this.data[n][i+1][1] < this.data[n][i][1]) ? this.data[n][i+1][1] : this.data[n][i][1];
                        
                        var big = (this.data[n][i+1][1] < this.data[n][i][1]) ? this.data[n][i][1] : this.data[n][i+1][1];
                        
                        var per = 100 - parseInt(small / big * 100);
                        
                        ctx[n].fillText(per + '%', x - ((x - x2) / 2) - 10, height - 60);
                        
                    }
                    

                }

            
            ctx[n].stroke();
            
            // downline (mark)

            ctx[n].strokeStyle = '#000000';

            ctx[n].beginPath();

            ctx[n].moveTo(0,height - 45);

            ctx[n].lineTo(width,height - 45);

            ctx[n].stroke();

            // end downline

        }

    }

    return ret;

}











