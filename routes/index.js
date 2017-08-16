var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Tech Geek' });
});

module.exports = router;


/*create employee service*/
router.post('/techgeek/v1/createEmployee', function(req,res,next){
try{
	var reqObj = req.body;
	console.log(reqObj);
	req.getConnection(function(err, conn){
		if(err)
		{
			console.error('SQL Coonnection error', err);
			return next(err);
		}
		else
		{
			var insertSql = "INSERT INTO employee SET ?";
			var insertValues = {
				"Emp_Name" : reqObj.empName,
				"Role_Id" : reqObj.roleId,
				"Dept_Id" : reqObj.deptId  
			};
			var query = conn.query(insertSql, insertValues, function(err, result){
				if(err){
					console.error('SQL error', err);
					return next(err);
				}
				console.log(result);
				var Employee_Id = result.insertId;
				res.json({"Emp_id":Employee_Id});
			});
		}
	});
}
catch(ex){
	console.err("Internal error:"+ex);
	return next(ex);

}
});


//Get Employee Service

router.get('/techgeek/v1/getEmployeeDetails', function(req, res, next){
	try{
		var roleId = req.param('roleId');
		var deptId = req.param('deptId');

		/*var query = url.parse(req.url,true).query;
		console.log(query);
		var roleId = query.roleId;
		var deptId = query.deptId;*/


		console.log(roleId);
		console.log(deptId);
		req.getConnection(function(err, conn){
			if(err){
				console.error('SQL Coonnection error: ',err);
				return next(err);
			}
			else{
				conn.query('select E.Emp_Name,Date_Format(E.Doj,"%d-%m-%y")AS DOJ,D.Dept_Name, R.Role_Name from employee E, role R, department D where E.Role_Id=R.Role_Id and E.Dept_Id=D.Dept_Id and E.Role_Id=? and E.Dept_Id=? order by DOJ',[roleId,deptId],function(err, rows, fields){
					if(err){
						console.error('SQL Error: ',err);
					}
					var resEmp = [];
					for (var empIndex in rows){
						var empObj = rows[empIndex ];
						resEmp.push(empObj);
					}
					res.json(resEmp);
				});
			}
		});
	}catch(ex){
		console.error("Internal Error: "+ex);
		return next(ex);
	}
});



//Delete A column

router.delete('/techgeek/v1/deleteEmployeeDetails', function(req, res, next){
	try{
		var empId = req.param('empId');

		/*var query = url.parse(req.url,true).query;
		console.log(query);
		var roleId = query.roleId;
		var deptId = query.deptId;*/


		console.log(empId);
		req.getConnection(function(err, conn){
			if(err){
				console.error('SQL Coonnection error: ',err);
				return next(err);
			}
			else{
				conn.query('DELETE FROM employee WHERE Emp_id = ?;',[empId],function(err, rows, fields){
					if(err){
						console.error('SQL Error: ',err);
					}
					var resEmp = [];
					for (var empIndex in rows){
						var empObj = rows[empIndex ];
						resEmp.push(empObj);
					}
					res.json(resEmp);
				});
			}
		});
	}catch(ex){
		console.error("Internal Error: "+ex);
		return next(ex);
	}
});
