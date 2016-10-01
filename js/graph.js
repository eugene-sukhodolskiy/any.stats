function getGraph(param){

    param.size = param.size || 20;

    var ret = {

        canvas: param.canvas,

        data: [],

        sizeY: param.size,
        
        sizeX: 120,

        colors: ['red','blue','green','grey','orange','black'],

        set: function(content){

            this.data = content;
            
            var w = this.sizeX * this.data[0].length + 200;
            
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

            var ctx = [];

            for(var n=0;n<this.data.length;n++){

                ctx[n] = document.getElementById(this.canvas);

                var height = parseInt($('#'+this.canvas).attr('height'));

                ctx[n] = ctx[n].getContext('2d');

                ctx[n].strokeStyle = this.colors[n];

                ctx[n].fillStyle = this.colors[n];

                ctx[n].beginPath();
                
                ctx[n].font = 'normal 18px sans-serif';

                for(var i=0;i<this.data[n].length;i++){

                    var x = parseInt(this.data[n][i][0] * this.sizeX);

                    var y = parseInt(this.data[n][i][1] * this.sizeY + 20);

                    y = height - y;

//                    console.log(x+':'+y);

                    if(i)
                        ctx[n].lineTo(x,y);
                    else
                        ctx[n].moveTo(x,y);

                    ctx[n].fillRect(x-6,y-6,12,12);
                    
                    
                    // value
                    
                    ctx[n].fillText(this.data[n][i][1], x - 12, y - 20);
                    
                    
                    // date
                    
                    ctx[n].fillStyle = 'black';
                    
                    ctx[n].fillText(this.data[n][i][3], x - 20, height - 20);
                    
                    ctx[n].fillStyle = this.colors[n];
                    
                    
                    
                    // percent
                    
//                    if(i != this.data[n].length - 1){
//                        
//                        var x2 = parseInt(this.data[n][i+1][0] * this.sizeX);
//
//                        var y2 = parseInt(this.data[n][i+1][1] * this.sizeY + 20);
//                        
//                        var small = (this.data[n][i+1][1] < this.data[n][i][1]) ? this.data[n][i+1][1] : this.data[n][i][1];
//                        
//                        var big = (this.data[n][i+1][1] < this.data[n][i][1]) ? this.data[n][i][1] : this.data[n][i+1][1];
//                        
//                        var per = 100 - parseInt(small / big * 100);
//                        
//                        ctx[n].fillText(per + '%', x - ((x - x2) / 2), y - ((y2 - y) / 2));
//                        
//                    }

                }

                ctx[n].stroke();

            }

        }

    }

    return ret;

}











