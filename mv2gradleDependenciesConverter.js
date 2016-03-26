#!/usr/bin/jjs

/*
 <dependency>
    <groupId>??</groupId>
    <artifactId>??</artifactId>
    <version>??</version>
    <scope>compile</scope>
 </dependency>
*/

function getNode(str,name){
    var rg="<\s*"+name+"\s*>\s*([^>]+)<\s*\/\s*"+name+"\s*>";
    var re=RegExp(rg,"gi");
    var rs=re.exec(str);
    return !rs?undefined:rs[1];
}

function getGroupId(str){
    return getNode(str,"groupId");
}

function getArtifactId(str){
    return getNode(str,"artifactId");
}

function getVersion(str){
    return getNode(str,"version");
}

function getScope(str){
    return getNode(str,"scope");
}

function getDependencies(str){
    var match;
    var out=[];
    var re=/<\s*dependency\s*>([\s\S]*?)<\s*\/\s*dependency\s*>/ig;
    while(match=re.exec(str)){
       out.push(match[1]);
    }
    return out;    
}

function convert(maven){
    var dependencies=getDependencies(maven);   
    var out="";
    for(var i=0;i<dependencies.length;i++){
        var groupId=getGroupId(dependencies[i]);
        var version=getVersion(dependencies[i]);
        var artifactId=getArtifactId(dependencies[i]);
        var scope=getScope(dependencies[i]);        
        out+=scope?scope:"compile \""+groupId+":"+artifactId+":"+version+"\"\n";        
    }
    return out;
}

if(!arguments[0]){
    print("Usage: ./mv2gradleDependenciesConverter.js -- pom.xml\n");
}else{
    var txt=readFully(arguments[0]);
    print(convert(txt));
}