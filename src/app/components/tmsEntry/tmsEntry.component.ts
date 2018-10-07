import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Router } from '@angular/router';
/*import * as $ from 'jquery';
import 'jqueryui';*/
declare var $: any;
@Component({
  selector: 'tms_entry',
  templateUrl: './tmsEntry.component.html',
  styleUrls: ['./tmsEntry.component.css'],
  providers: [SocketService]
})
export class TMSEntryComponent implements OnInit, OnDestroy, AfterViewInit {
  startDate: any;
  endDate: any;
  selectedDate: any;
  private connection;
  userTimesheetData: any = [];
  private projectsList: any = [];
  selected = this.projectsList[0];
  typesOfTasks = [
    /*{
      text: 'Normal',
      type: "extrahours0"
    },*/
    {
      text: 'Overtime1',
      type: "extrahours1"
    },
    {
      text: 'Overtime2',
      type: "extrahours2"
    }
  ]
  typesOfLeave = [
    {
      text: 'Vacation/Leave',
      type: "extrahours3"
    },
    {
      text: 'Sick Leave',
      type: "extrahours4"
    },
    {
      text: 'Care of sick child (VAB)',
      type: "extrahours5"
    }
  ]

  constructor(private socketService: SocketService, private _router: Router,
    private elRef: ElementRef) { }

  ngOnInit() {
    var self = this;
    this.initialzeCalendar();
    this.connection = this.socketService.getMessages().subscribe(data => {
      console.log(data);
      if (data) {
        let actualMessage;
        actualMessage = data;
        let modData = JSON.parse(actualMessage);
        if (modData && modData.length > 0 && modData[0].type === "fetchTimesheet") {
          delete modData[0]["type"];
          console.log("fetch timesheet successful");
          this.userTimesheetData = modData;
          this.fillTable(modData);
        } else if (modData && modData.length > 0 && modData[0].type === "fetchProjectSuccess") {
          if (modData[0].hasOwnProperty("projects")) {
            let userInfo = JSON.parse(sessionStorage.userInfo)
            userInfo.projects = modData[0].projects;
            sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
            this.projectsList = modData[0].projects.split(',');
            this.selected = this.projectsList.length > 0 ? this.projectsList[0] : "";
          }
        } else {
          console.log("msg not unserstood in timesheet component");
        }
      }
    });
  }

  ngAfterViewInit() {
    this.fetchTimesheet();
    this.fetchProjectsList();
  }

  createTable() {
    var num_rows = 1;
    var num_cols = 7;
    var theader = '<table border="1" id = "timesheetTable">\n';
    var tbody = '';
    var dates = this.getAllDates();
    var defaultValue = 0;
    var currentDate = new Date();
    for (var i = 0; i < num_rows; i++) {
      tbody += '<tr>';
      tbody += '<th> Type </th>';
      for (var j = 0; j < num_cols; j++) {
        tbody += '<th>';
        if (j === 0) {
          tbody += "Mon"
        } else if (j === 1) {
          tbody += "Tue";
        } else if (j === 2) {
          tbody += 'Wed';
        } else if (j === 3) {
          tbody += 'Thu';
        } else if (j === 4) {
          tbody += 'Fri';
        } else if (j === 5) {
          tbody += 'Sat';
        } else if (j === 6) {
          tbody += 'Sun';
        }
        tbody += "- " + dates[j].getDate();
        tbody += '</th>';
      }
      tbody += '<th> Total </th>';
      tbody += '</tr>\n';
    }
    for (var i = 0; i < num_rows; i++) {
      tbody += '<tr>';
      tbody += '<td> Normal </td>';
      for (var j = 0; j < num_cols; j++) {
        tbody += '<td>';
        if (j === 5 || j === 6 || (currentDate.getMonth() !== dates[j].getMonth())) {
          tbody += '<input type = "text" attr = normal ' + 'value =' + defaultValue + ' ' + 'disabled name =' + String(dates[j].getDate()) + "/" + String(dates[j].getMonth() + 1) + "/" + String(dates[j].getFullYear()) + '>';
        } else {
          tbody += '<input type = "text" attr = normal ' + 'value =' + defaultValue + ' ' + 'name =' + String(dates[j].getDate()) + "/" + String(dates[j].getMonth() + 1) + "/" + String(dates[j].getFullYear()) + '>';
        }
        tbody += '</td>';
      }
      tbody += '<td> <input type = "text" typeTotalAttr = normalWeekTotal  disabled value = 0> </input> </td>';
      tbody += '</tr>\n';
      this.elRef.nativeElement.querySelector('button').classList.remove("hide");
    }
    var tfooter = '</table>';
    document.getElementById('wrapper').innerHTML = theader + tbody + tfooter;
    for (var i = 0; i < 5; i++) {
      var checkbox = $('mat-checkbox')[i];
      if (checkbox.classList[checkbox.classList.length - 1] == 'mat-checkbox-checked') {
        switch (i) {
          case 0: this.createRow(0, this.typesOfTasks[0].text);
            break;
          case 1: this.createRow(1, this.typesOfTasks[1].text);
            break;
          case 2: this.createRow(2, this.typesOfLeave[0].text);
            break;
          case 3: this.createRow(3, this.typesOfLeave[1].text);
            break;
          case 4: this.createRow(4, this.typesOfLeave[2].text);
            break;

        }
      }

    }
    this.fetchTimesheet();
    $('label.totalHours').text("Total = " + 0);
  }

  onCheckbox($event) {
    var text = $event.source._elementRef.nativeElement.innerText;
    var attr = $event.source._elementRef.nativeElement.getAttribute('data-index');
    if ($event.checked) {
      this.createRow(attr, text);
    } else {
      this.deleteRow(attr);
    }
  }

  createRow(attr, text) {
    var tbody = '';
    // var parentRow = this.elRef.nativeElement.querySelectorAll('tbody')[1];
    var parentRow = $('#timesheetTable > tbody:last-child');
    var newRow = '';
    var num_rows = 1;
    var num_cols = 7;
    var dates = this.getAllDates();
    var defaultValue = 0;
    for (var i = 0; i < num_rows; i++) {
      tbody += '<tr class =' + attr + '>';
      tbody += '<td>' + text + '</td>';
      for (var j = 0; j < num_cols; j++) {
        var currentDate = new Date();
        tbody += '<td>';
        if (j === 5 || j === 6 || (currentDate.getMonth() !== dates[j].getMonth())) {
          tbody += '<input type = "text" attr =' + attr + ' value =' + defaultValue + ' ' + 'disabled name =' + String(dates[j].getDate()) + "/" + String(dates[j].getMonth() + 1) + "/" + String(dates[j].getFullYear()) + '>';
        } else {
          tbody += '<input type = "text" attr =' + attr + ' value =' + defaultValue + ' ' + 'name =' + String(dates[j].getDate()) + "/" + String(dates[j].getMonth() + 1) + "/" + String(dates[j].getFullYear()) + '>';
        }
        tbody += '</td>';
      }
      tbody += '<td> <input type = "text" typeTotalAttr = ' + attr + ' disabled value = 0> </input> </td>';
      tbody += '</tr>\n';
      parentRow.append(tbody);
      this.elRef.nativeElement.querySelector('button').classList.remove("hide");
    }
  }

  deleteRow(attr) {
    switch (attr) {
      case "0":
        $("#timesheetTable .0").remove();
        break;
      case "1":
        $("#timesheetTable .1").remove();
        break;
      case "2":
        $("#timesheetTable .2").remove();
        break;
      case "3":
        $("#timesheetTable .3").remove();
        break;
      case "4":
        $("#timesheetTable .4").remove();
        break;
      case "5":
        $("#timesheetTable .5").remove();
        break;
    }
    //$(".profile-fields tr:contains('terms')").remove();​​​​
  }

  fetchProjectsList() {
    let userInfo = JSON.parse(sessionStorage.userInfo);
    let msg = {
      type: "fetchProjectList",
      userId: userInfo.userId
    };
    this.sendMessage(msg);
  }

  ngOnDestroy() {
  }

  initialzeCalendar() {
    var self = this;
    $(function () {
      var selectCurrentWeek = function () {
        self.createTable();
        window.setTimeout(function () {
          $('.week-picker').find('.ui-datepicker-current-day a').addClass('ui-state-active')
        }, 1);
      }

      $('.week-picker').datepicker({
        showOtherMonths: true,
        selectOtherMonths: false,
        firstDay: 1,
        onSelect: function (dateText, inst) {
          var date = $(this).datepicker('getDate');
          self.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
          self.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7);
          self.selectedDate = date;
          var dateFormat = inst.settings.dateFormat || $.datepicker._defaults.dateFormat;
          $('#startDate').text($.datepicker.formatDate(dateFormat, self.startDate, inst.settings));
          $('#endDate').text($.datepicker.formatDate(dateFormat, self.endDate, inst.settings));

          selectCurrentWeek();
        },
        beforeShowDay: function (date) {
          var cssClass = '';
          if (date >= self.startDate && date <= self.endDate)
            cssClass = 'ui-datepicker-current-day';
          return [true, cssClass];
        },
        onChangeMonthYear: function (year, month, inst) {
          selectCurrentWeek();
        }
      });

      $('.week-picker .ui-datepicker-calendar tr').live('mousemove', function () { $(this).find('td a').addClass('ui-state-hover'); });
      $('.week-picker .ui-datepicker-calendar tr').live('mouseleave', function () { $(this).find('td a').removeClass('ui-state-hover'); });
    });
  }

  getAllDates() {
    let start = new Date(document.getElementById("startDate").textContent),
      end = new Date(document.getElementById("endDate").textContent),
      year = start.getFullYear(),
      month = start.getMonth(),
      day = start.getDate(),
      dates = [start];

    while (dates[dates.length - 1] < end) {
      dates.push(new Date(year, month, ++day));
    }
    return dates;
  }

  fetchTimesheet() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    let msg = {
      type: "fetchTimesheet",
      userId: userInfo.userId,
      tableName: sessionStorage.getItem("tableName"),
    };
    this.sendMessage(msg);
  }

  sendMessage(message) {
    this.socketService.sendMessage(message);
  }

  submitTimesheet() {
    let userInfo = JSON.parse(sessionStorage.userInfo);
    let msg = {
      type: "submitTimesheet",
      userInfo: userInfo.username,
      tableName: sessionStorage.getItem("tableName"),
      managerEmail: userInfo.managerEmail
    };
    this.sendMessage(msg);
  }


  validateAndSave() {
    var total = 0;
    var firstDate = this.startDate;
    var lastDate = this.endDate;
    var dates = this.getAllDates();
    var dataObj = {};
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    var currentDate = new Date();
    var $td;

    //var $td = $("#wrapper tr td input");

    var normalTotal = 0;
    var overtime1Total = 0;
    var overtime2Total = 0;
    var vacationLeaveTotal = 0;
    var sickLeaveTotal = 0;
    var childCareLeaveTotal = 0;
    for (var i = 0; i < 5; i++) {
      var name = String(dates[i].getDate()) + "/" + String(dates[i].getMonth() + 1) + "/" + String(dates[i].getFullYear());
      if (currentDate.getMonth() === dates[i].getMonth()) {
        $td = document.getElementsByName(name);
        
        var normal = '0';
        var overtime1 = '0';
        var overtime2 = '0';
        var vacationLeave = '0';
        var sickLeave = '0';
        var childCareLeave = '0';
        var save = false;
        for (var j = 0; j < $td.length; j++) {
          // var key = String(dates[i].getDate()) + "/" + String(dates[i].getMonth() + 1) + "/" + String(dates[i].getFullYear());
          if ($td[j].getAttribute('attr') == "normal") {
            normal = $td[j].value;
            save = true;
            total = total + Number($td[j].value);
            normalTotal = normalTotal + Number($td[j].value);;
          } else if ($td[j].getAttribute('attr') === "0") {
            overtime1 = $td[j].value;
            total = total + Number($td[j].value);
            save = true;
            overtime1Total = overtime1Total + Number($td[j].value);
          } else if ($td[j].getAttribute('attr') === "1") {
            overtime2 = $td[j].value;
            save = true;
            total = total + Number($td[j].value);
            overtime2Total = overtime2Total + Number($td[j].value);
          } else if ($td[j].getAttribute('attr') === "2") {
            vacationLeave = $td[j].value;
            save = true;
            total = total + Number($td[j].value);
            vacationLeaveTotal = vacationLeaveTotal + Number($td[j].value);
          } else if ($td[j].getAttribute('attr') === "3") {
            sickLeave = $td[j].value;
            save = true;
            total = total + Number($td[j].value);
            sickLeaveTotal = sickLeaveTotal + Number($td[j].value);
          } else if ($td[j].getAttribute('attr') === "4") {
            childCareLeave = $td[j].value;
            save = true;
            total = total + Number($td[j].value);
            childCareLeaveTotal = childCareLeaveTotal + Number($td[j].value);
          }
        }
        if (save) {
         
          let msg = {
            type: "timesheetInfo",
            userId: userInfo.userId,
            tableName: sessionStorage.getItem("tableName"),
            dates: String(name),
            normal: normal || 0,
            overtime1: overtime1 || 0,
            overtime2: overtime2 || 0,
            vacationLeave: vacationLeave || 0,
            sickLeave: sickLeave || 0,
            childCareLeave: childCareLeave || 0,
            project: this.selected,
            dateNumber: dates[i].getDate(),
            month: dates[i].getMonth() + 1,
            year: dates[i].getFullYear()
          };
          this.sendMessage(msg);
          var typeTotal = {
            normalTotal: normalTotal,
            overtime1Total: overtime1Total,
            overtime2Total: overtime2Total,
            vacationLeaveTotal: vacationLeaveTotal,
            sickLeaveTotal: sickLeaveTotal,
            childCareLeaveTotal : childCareLeaveTotal
          }
          this.showTypeHours(typeTotal);
        }
       
      }
     
    }
    $('label.totalHours').text("Total = " + total);
  }

  showTypeHours(typeTotal) {
    $("input[typeTotalAttr=normalWeekTotal]").val(typeTotal.normalTotal);
    $("input[typeTotalAttr=0]").val(typeTotal.overtime1Total);
    $("input[typeTotalAttr=1]").val(typeTotal.overtime2Total);
    $("input[typeTotalAttr=2]").val(typeTotal.vacationLeaveTotal);
    $("input[typeTotalAttr=3]").val(typeTotal.sickLeaveTotal);
    $("input[typeTotalAttr=4]").val(typeTotal.childCareLeaveTotal);
  }


  fillTable(data) {
    var $td = $("#wrapper tr td input");
    //let data1 = [{ "userId": 1, "dates": "1/1/2018", "dateValue": "8", "type": "fetchTimesheet" }, { "userId": 1, "dates": "2/1/2018", "dateValue": "9" }, { "userId": 1, "dates": "3/1/2018", "dateValue": "6" }, { "userId": 1, "dates": "4/1/2018", "dateValue": "5" }, { "userId": 1, "dates": "5/1/2018", "dateValue": "3" }]
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < $td.length; j++) {
        if ($td[j].attributes["name"] && $td[j].attributes["name"].value === data[i].dates) {
          if ($td[j].getAttribute('attr') == 'normal') {
            $td[j].value = data[i].normal;
          } else if ($td[j].getAttribute('attr') == '0') {
            $td[j].value = data[i].overtime1;
          } else if ($td[j].getAttribute('attr') == '1') {
            $td[j].value = data[i].overtime2;
          } else if ($td[j].getAttribute('attr') == '2') {
            $td[j].value = data[i].vacationLeave;
          } else if ($td[j].getAttribute('attr') == '3') {
            $td[j].value = data[i].sickLeave;
          } else if ($td[j].getAttribute('attr') == '4') {
            $td[j].value = data[i].childCareLeave;
          }
        }
      }
    }
  }

  downloadTimesheet() {
    if (this.userTimesheetData) {
      this.JSONToCSVConvertor(this.userTimesheetData, "Report", true);
    } else {
      alert("select any date");
    }
  }

  JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
      var row = "";

      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {

        //Now convert each value to string and comma-seprated
        row += index + ',';
      }

      row = row.slice(0, -1);

      //append Label row with line break
      CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      var row = "";

      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
        row += '"' + arrData[i][index] + '",';
      }

      row.slice(0, row.length - 1);

      //add a line break after each row
      CSV += row + '\r\n';
    }

    if (CSV == '') {
      alert("Invalid data");
      return;
    }

    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + encodeURI(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    //link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}