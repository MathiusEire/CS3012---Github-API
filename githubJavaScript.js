function loadXMLDoc(){
	document.getElementById("basic info").innerHTML = "loading";
	var input = document.getElementById("userInput").value;
	var output = retrieveJson("https://api.github.com/users/"+input);
	console.log(output);
	loadBaiscInfo(output);
	listFollowers(retrieveJson(output.followers_url));
	commitHistory(output);
}

function retrieveJson(url){
	console.log(url);
	var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
	x = JSON.parse(Httpreq.responseText);
    return x;
}

function loadBaiscInfo(obj){
	var login = obj.login;
	var avatar_url = obj.avatar_url;
	var public_repos = obj.public_repos;
	var followers = obj.followers;
	var following = obj.following;
	var name = obj.name;
	
	//create tags with the html for the new info
	var info = document.createElement("div");
	info.id  = "basic info";
	var avatar = document.createElement("img");
	var contents = document.createElement("p");
	
	
	avatar.src =  avatar_url;
	avatar.style = "width: 200px;height:200px";
	avatar.id = "avatar"
	contents.id = "basicContents"
	//add to wrapping tag
	contents.innerHTML = 
		"Name :" + name +", Login: "+ login + " Followers:"+followers + ", Following: " +following;
	info.appendChild(avatar);
	info.appendChild(contents);
	
	//replace whatever was there 
	var body = 	document.getElementById("wrapping");
	body.replaceChild(info,document.getElementById("basic info"));
}

function listFollowers(obj){
	var follower_logins = [];
	var follower_avatars =[];
	var follower_repos = [];
	for(var i = 0 ; i < obj.length ; i++)
	{
		follower_logins.push(obj[i].login);
		follower_avatars.push(obj[i].avatar_url);
		follower_repos.push(obj[i].public_repos);
		
	}
	
	var follower_table = document.createElement("div");
	follower_table.id  = "F_T";
	
	for(var i = 0 ; i < obj.length ; i++){
		var user = document.createElement("div");
		var avatar = document.createElement("img");
		var contents = document.createElement("p");
		avatar.style = "width: 100px;height:100px";
		avatar.id = "avatar";
		contents.id = "followerContents";
		avatar.src = follower_avatars[i];	
		contents.innerHTML = "Login: "+ follower_logins[i];
		user.appendChild(avatar);
		user.appendChild(contents);
		follower_table.appendChild(user);
	}
	
	var body = 	document.getElementById("wrapping");
	body.replaceChild(follower_table,document.getElementById("F_T"))
}

function commitHistory(jsonText){
	var data =getData(jsonText);
	console.log(data);
	body.replaceChild(follower_table,document.getElementById("Commits"))
}

function getData(obj){
	var repos = retrieveJson(obj.repos_url);
	var commits = [];
	var commit_count =0;
	console.log(repos.length);
	var returnData=[];
	for(var i = 0 ; i<repos.length;i++)
	{
		c_url =repos[i].commits_url.substring(0,repos[i].commits_url.length-6) + "?per_page=100";
		commits = retrieveJson(c_url);
		commit_count += commits.length;
		returnData.push({"repo_name":repos[i].name, "commits":commits.length});
	}
	console.log(returnData);
	return returnData;
}