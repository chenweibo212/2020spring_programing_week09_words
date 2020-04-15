int c = 0;
int R = 300;

void setup(){
    size(640,640);
    background(255);
}

void draw(){
    //clear();
    background(255);
    c++;
    int x = 180;
    int y = 100;
    //n(x,y,50,1,0);
    for(int i = 0; i < 4; i++){
      float r = sin((c-10*(i-1)) * 0.03) * PI/8;
      line(x,y,x+=sin(r)*R/3, y+=cos(r)*R/3);
      n(x,y,30,0,r);
    }
}

void n(float x, float y, float w, float f, float r){
  line(x-w, y-w, x+w, y+w);
  for(int j = -1; j <2; j += 2){
    float a = x+w*j+w*2*sin(r);
    float b = y+w*j+w*2*cos(r) + f*300;
    if(r != 0){
      float d = noise(a/height,b/height)*TAU*77;
      a += cos(d) * 5;
      b += sin(d) * 5;
    }
    line(x+w*j, y+w*j, a, b);
  }
}
  
