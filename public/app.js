var currentTableData, mainTableData, currentSeriesData, currentStatus = [];
$(document).ready(function(){
 	$.getJSON("https://wrapapi.com/use/dessoto/icc/test_rankings/latest?wrapAPIKey=hsMTdtkcfRcfJKKB3scgc1kY3vbeLWfZ")
 	.then(function(datum) {
 		$(".loader2").css("display","none")
 		arrangeTable(datum.data.table,1)
 	})
 	.catch(function(err) {
 		console.log(err)
 	})
 	$.getJSON("/api/data")
 	.then(function(seriesData){
 		currentSeriesData = seriesData 
 		for (var i = 0; i < seriesData.length; i++) {
 			currentStatus.push({team1score:0,team2score:0})
 		}
 		$(".loader1").css("display","none")
 		if (document.documentElement.clientWidth < 700) arrangeSeries(seriesData,"small")
 		else arrangeSeries(seriesData,"big")
 	})
 	.catch(function(err) {
 		console.log(err)
 	})
 })

 function is_numeric(str){return /^\d+$/.test(str)}
 function arrangeSeries(data, type) {
		var str = ""
 	if (type!="big") {str="Short"}

 	data.forEach(function(obj,i) {
 		$("#predictionDiv").append(`<div class="prediv">
				 <div>
				 	${obj.matches} match series
				 </div>
				 <div>
				 	<div>
				 		<div><img src="https://www.icc-cricket.com/resources/ver/i/flags/${obj.team1Short}.svg">	</div>
				 		<div><p>${obj["team1"+str]}</p></div>
				 	</div>
				 	<div>
				 		<div>
				 			<div onclick="increase(${i+1},1)">
				 				<i class="fas fa-caret-up"></i>
				 			</div>
				 			<div>
				 				<p>-</p>
				 			</div>
				 			<div onclick="decrease(${i+1},1)">
				 				<i class="fas fa-caret-down"></i>
				 			</div>
				 		</div>
				 		<div>
				 			<div onclick="increase(${i+1},2)">
				 				<i class="fas fa-caret-up"></i>
				 			</div>
				 			<div>
				 				<p>-</p>
				 			</div>
				 			<div onclick="decrease(${i+1},2)">
				 				<i class="fas fa-caret-down"></i>
				 			</div>
				 		</div>
				 	</div>
				 	<div>
				 		<div><img src="https://www.icc-cricket.com/resources/ver/i/flags/${obj.team2Short}.svg">	</div>
				 		<div><p>${obj["team2"+str]}</p></div>
				 	</div>
				 </div>
				</div>`)
 	})
 }
 function arrangeTable(data,from) {
 	$("tbody").remove()
 	$("#comptable").append("<tbody> <tr> <th>Pos</th> </tr> </tbody> ")	
if (from == 1) {
	data.forEach(function(obj){
	 		
		 if (is_numeric(obj["matches"])) obj["matches"]= +obj["matches"]

		 if (is_numeric(obj["rating"])) obj["rating"]= +obj["rating"]
		else{obj["rating"] = +obj["rating"].replace(/–/,0)}

		obj["points"] = obj["points"].replace(/–/,0)
		obj["points"] =+obj["points"].split(",").join("")
		obj["team"] = obj["team"].split("*").join("")
		obj["flag"] = obj["flag"].split("//").join("")
	
		})
}


 	$("#comptable tbody tr:nth-of-type(1)").append('<th class="properties">Team</th>')
 	// $("#comptable tbody tr:nth-of-type(1)").append('<th class="properties">Matches</th>')
 	// $("#comptable tbody tr:nth-of-type(1)").append('<th class="properties">Points</th>')
 	$("#comptable tbody tr:nth-of-type(1)").append('<th class="properties">Rating</th>')
  		 	
	  var count = 1
data.sort(function(a,b){
		return  (a["rating"] < b["rating"]) ? 1 : (b["rating"]  < a["rating"]) ? -1 : 0
		}).forEach(function(elem)

		{
		   count++
		   document.querySelector("tbody").appendChild(document.createElement('tr'))
		   var Rank = count-1
		    $("#comptable tbody tr:nth-of-type("+count+")").append("<td><strong><span style='margin-right:5px;'>"+Rank + "</span></strong><i class='fas fa-caret-down'></i><i class='fas fa-caret-up'></i></td>")
		   	$("#comptable tbody tr:nth-of-type("+count+")").append("<td><img src='https://"+elem["flag"]+"'>" +elem["team"] +"</td>")
		   	// $("#comptable tbody tr:nth-of-type("+count+")").append("<td>" +elem["matches"] +"</td>")
		   	// $("#comptable tbody tr:nth-of-type("+count+")").append("<td>" +elem["points"] +"</td>")
		   	$("#comptable tbody tr:nth-of-type("+count+")").append("<td>" +elem["rating"] +"</td>")

		    	document.querySelectorAll("td i")[2*(Rank-1)].style.color = "red"
		    	document.querySelectorAll("td i")[2*(Rank-1)].style.opacity = "0"
		    	document.querySelectorAll("td i")[2*(Rank-1)+1].style.color = "green"
		    	document.querySelectorAll("td i")[2*(Rank-1)+1].style.opacity = "0"
	    })
	    if (from == 1) {
	    	mainTableData = data
	    	currentTableData = []
  			 data.forEach(function(item,index) {
   				currentTableData.push({})
  			 	currentTableData[index] = Object.assign(currentTableData[index],item)
  			 }) 
         }
        
}

async function increase(seriesNumber,teamNumber) {
	if (currentSeriesData[seriesNumber-1].matches >= currentStatus[seriesNumber-1].team1score+currentStatus[seriesNumber-1].team2score ) {
		if (currentSeriesData[seriesNumber-1].matches > currentStatus[seriesNumber-1].team1score+currentStatus[seriesNumber-1].team2score) {
		 await change(seriesNumber,teamNumber,1)
		 await changeTheTable()
		}
	else if(currentSeriesData[seriesNumber-1].matches == currentStatus[seriesNumber-1].team1score+currentStatus[seriesNumber-1].team2score){
		 if (teamNumber == 1) {
		 	if (currentStatus[seriesNumber-1].team2score != 0){
		 		await change(seriesNumber,2,-1)
		 		await change(seriesNumber,teamNumber,1)
		 		await changeTheTable()
		 	}
		 } 
		 if (teamNumber == 2) {
		 	if (currentStatus[seriesNumber-1].team1score != 0){
		 		await change(seriesNumber,1,-1)
		 		await change(seriesNumber,teamNumber,1)
		 		await changeTheTable()
		 	}
		 }
	}
}}
async function decrease(seriesNumber,teamNumber) {
	if (currentStatus[seriesNumber-1]["team"+teamNumber+"score"]  > 0 ) {
		 await change(seriesNumber,teamNumber,-1)
	     await changeTheTable()
}
	else{console.log("cant")}
}
var changedSeries= []
async function change(seriesNumber,teamNumber, order){
	
		if (order==1) {
			currentStatus[seriesNumber-1]["team"+teamNumber+"score"]++
 	document.querySelector(`.prediv:nth-of-type(${seriesNumber+1})>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(2)>p`).innerText = currentStatus[seriesNumber-1]["team1score"]
	document.querySelector(`.prediv:nth-of-type(${seriesNumber+1})>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(2)>p`).innerText = currentStatus[seriesNumber-1]["team2score"]
		}
		if (order==-1) {
			currentStatus[seriesNumber-1]["team"+teamNumber+"score"]--
 	document.querySelector(`.prediv:nth-of-type(${seriesNumber+1})>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(2)>p`).innerText = currentStatus[seriesNumber-1]["team1score"]
	document.querySelector(`.prediv:nth-of-type(${seriesNumber+1})>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(2)>p`).innerText = currentStatus[seriesNumber-1]["team2score"]
		
		}
		return new Promise(function(resolve,reject) {
			resolve("done!")
			reject("error!!")
		})

}

function toBeChanged() {
		var output = []
		var changed = []
		var nos = currentSeriesData.length
		for (var i = 0; i < nos; i++) {
	 output.push(document.querySelector(`.prediv:nth-of-type(${i+2})>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(2)>p`).innerText)
		}
		for (var i = 0; i < output.length; i++) {
			if(output[i] != "-"){
					changed.push(i+1)
			}
		}
		return changed
}


async function changeTheTable() {
	var allChanged = toBeChanged()
	var changeThese = []
		
	for (var i = 0; i < allChanged.length; i++) {
		changeThese.push({
			TotalMatches : currentSeriesData[allChanged[i]-1].matches,

			team1        : {
							name : currentSeriesData[allChanged[i]-1].team1
							},

			team2        : {
							name : currentSeriesData[allChanged[i]-1].team2
							}
		})
	}
	
	for (var i = 0; i < changeThese.length; i++) {
		for (var j = 0; j < currentTableData.length; j++) {
			if(currentTableData[j].team == changeThese[i].team1.name){
				changeThese[i].team1.points   =   currentTableData[j].points
				changeThese[i].team1.matches  =   currentTableData[j].matches
				changeThese[i].team1.rating   =	  currentTableData[j].rating
			}
			if(currentTableData[j].team == changeThese[i].team2.name){
				changeThese[i].team2.points   =   currentTableData[j].points
				changeThese[i].team2.matches  =   currentTableData[j].matches
				changeThese[i].team2.rating   =	  currentTableData[j].rating
			}
		}
		for (var j = 0; j < allChanged.length; j++) {
		changeThese[j].team1.wins   =   currentStatus[allChanged[j]-1].team1score
		changeThese[j].team2.wins   =   currentStatus[allChanged[j]-1].team2score
	}    
		  console.log(changeThese)
		  RPA(changeThese[i].TotalMatches,changeThese[i].team1,changeThese[i].team2)
		

	} 
		trackChange(currentTableData,mainTableData)
			currentTableData = []
			mainTableData.forEach(function(item,index) {
   			currentTableData.push({})
   			currentTableData[index] = Object.assign(currentTableData[index],item)
   })
   
}

function RPA(TotalMatches,team1,team2){
   var seriesPointsTeam1 = 0 
   var seriesPointsTeam2 = 0
   seriesPointsTeam1 += team1.wins
   seriesPointsTeam2 += team2.wins
   if (TotalMatches != team1.wins+team2.wins) {
   	seriesPointsTeam1 +=  0.5*(TotalMatches-(team1.wins+team2.wins))
   	seriesPointsTeam2 +=  0.5*(TotalMatches-(team1.wins+team2.wins))
   }
   if (team1.wins == team2.wins) {
   	seriesPointsTeam1 +=  0.5
    seriesPointsTeam2 +=  0.5
   } 
   if (team1.wins > team2.wins) {
   	seriesPointsTeam1 +=  1
   }
   if (team2.wins > team1.wins) {
   	seriesPointsTeam2 +=  1
   }

   // converting series points to rating points

   var ratingPointsTeam1
   var ratingPointsTeam2

   if (Math.abs(team1.rating - team2.rating) < 40 ) {
   	 ratingPointsTeam1 = seriesPointsTeam1*(team2.rating+50)+seriesPointsTeam2*(team2.rating-50)
   	 ratingPointsTeam2 = seriesPointsTeam2*(team1.rating+50)+seriesPointsTeam1*(team1.rating-50)
   }
   if (Math.abs(team1.rating - team2.rating) >= 40) {
   	if (team1.rating > team2.rating) {
   		ratingPointsTeam1 = seriesPointsTeam1*(team1.rating+10)+seriesPointsTeam2*(team1.rating-90)
   		ratingPointsTeam2 = seriesPointsTeam2*(team2.rating+90)+seriesPointsTeam1*(team2.rating-10)
   	}
   	if (team1.rating < team2.rating) {
   		ratingPointsTeam1 = seriesPointsTeam1*(team1.rating+90)+seriesPointsTeam2*(team1.rating-10)
   		ratingPointsTeam2 = seriesPointsTeam2*(team2.rating+10)+seriesPointsTeam1*(team2.rating-90)
   	}
   }
 	
   team1.matches += TotalMatches+1  
   team2.matches += TotalMatches+1
   team1.points  += ratingPointsTeam1  
   team2.points  += ratingPointsTeam2


    
   for (var i = 0; i <  currentTableData.length; i++) {
 
   	if( currentTableData[i].team == team1.name){
   		 currentTableData[i].matches = team1.matches
   		 currentTableData[i].points = team1.points
   		 currentTableData[i].rating = Math.round(team1.points/team1.matches)
   	}
   	if( currentTableData[i].team == team2.name){
   		 currentTableData[i].matches = team2.matches
   		 currentTableData[i].points = team2.points
   		 currentTableData[i].rating = Math.round(team2.points/team2.matches)
   	}
   }
   	arrangeTable(currentTableData,2)
 
}
function trackChange(dataCurrent,dataMain) {
	for (var i = 0; i < dataCurrent.length; i++) {

	for (var j = 0; j < dataMain.length; j++) {

		if( dataCurrent[i].team == dataMain[j].team){
			if (i==j) {

			}
			else if(i > j){
				document.querySelectorAll("td i")[2*(i)].style.opacity = "1"
				document.querySelectorAll("td i")[2*(i)+1].style.display = "none"
			}
			else {
				document.querySelectorAll("td i")[2*(i)+1].style.opacity = "1"
				document.querySelectorAll("td i")[2*(i)].style.display = "none"
			}
		}
	}
	}
}