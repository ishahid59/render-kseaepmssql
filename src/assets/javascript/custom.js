// https://www.techiediaries.com/use-javascript-in-angular/
// https://stackoverflow.com/questions/47346559/how-to-call-external-javascript-function-in-angular-5

function hello() {
    alert('Hello! from custom.js');
}

function getEditData(empid) {
    $.ajax({
        type: "get",
        url: "http://localhost:5000/api/employee/" + empid + "",
        success: function (result) {
            // console.log(result);
            $("#empid").val(result.empid);
            $("#firstname").val(result.firstname);
            $("#lastname").val(result.lastname);
            $("#jobtitle").val(result.jobtitle);
            $("#registration").val(result.registration);
        }
    });
}



// *** to clear token on tab/browser close
// $(document).ready(function () {
    // window.onbeforeunload = function () {
    //     localStorage.removeItem("token");
    //     return '';
    // };

// });



/* ProPhoto Datatable SELECTED ROW  */
$(document).ready(function () {
    // var table = $('#dtProPhoto').DataTable();
 
//     $('#dtProPhoto tbody').on('click', 'tr', function () {
//         if ($(this).hasClass('selected')) {
//             $(this).removeClass('selected');
//         } else {
//             table.$('tr.selected').removeClass('selected');
//             $(this).addClass('selected');
//         }
//     });
 
//     $('#button').click(function () {
//         table.row('.selected').remove().draw(false);
//     });
// });


/* ProPhoto Datatable SELECTED ROW  */
// $(document).ready(function () {
//     $('#dt tbody').on('click', 'tr', function () {
//         $("#dtProPhoto tbody tr").removeClass('tr_selected');
//         $(this).addClass('tr_selected');
//     });


// $("#dtProPhoto tbody tr").addClass('tr_selected');
// var table = $('#dtProPhoto').DataTable();
});



