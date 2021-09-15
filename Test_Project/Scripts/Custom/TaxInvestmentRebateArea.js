﻿var id = null;
var dTable = null;


$(document).ready(function () {

    Manager.GetDataForTable(0);

    $("#btnSave").click(function () {
        Manager.Save();
    });

    $("#btnEdit").click(function () {
        Manager.Update();
    });

    $("#btnDelete").click(function () {
        Manager.Delete();
    });


});

var Manager = {

    Save: function () {
        var name = $("#Name").val();

        if (name == "") {
            Message.Warning("Name is required!");
            return;
        }

        var remarks = $("#Remarks").val();
        var status = $("#Status").is(':checked');
        if (Message.Prompt()) {
            var data = {
                Name: name,
                Remarks: remarks,
                Status: status
            };
            var url = '/TaxInvestmentRebateArea/InsertTaxInvestmentRebateArea/';
            JsHelper.ajaxPost(url, data).then(function (response) {
                if (response == 401) {
                    Message.CustomError('Sorry! You are not authorized to perform this operation.');
                    return;
                }
                if (response.Succeeded) {
                    Manager.GetDataForTable(1);
                    Manager.Reset();
                    Message.CustomSuccess('Tax investment saved successfully');
                } else {
                    var errorMsg = 'ERROR:';
                    $.each(response.Errors,
                        function (index, error) {
                            errorMsg += '</br>' + error;
                        });
                    Message.Warning(errorMsg);
                }
            }).catch(function (error) {
                cl(error);
            });
        }
    },

    Update: function () {
        var name = $("#Name").val();
        if (name == "") {
            Message.Warning("Name is required!");
            return;
        }

        var remarks = $("#Remarks").val();
        var status = $("#Status").is(':checked');
        if (Message.Prompt()) {
            var data = {
                Id: id,
                Name: name,
                Remarks: remarks,
                Status: status
            };
            var url = '/TaxInvestmentRebateArea/UpdateTaxInvestmentRebateArea/';
            JsHelper.ajaxPost(url, data).then(function (response) {
                if (response == 401) {
                    Message.CustomError('Sorry! You are not authorized to perform this operation.');
                    return;
                }
                if (response.Succeeded) {
                    Manager.GetDataForTable(1);
                    Manager.Reset();
                    Message.CustomSuccess('Tax investment saved successfully');
                } else {
                    var errorMsg = 'ERROR:';
                    $.each(response.Errors,
                        function (index, error) {
                            errorMsg += '</br>' + error;
                        });
                    Message.Warning(errorMsg);
                }
            }).catch(function (error) {
                cl(error);
            });
        }
    },

    Delete: function () {
        if (Message.Prompt()) {
            var jsonParam = { investmentRebateAreaId: id };
            var serviceURL = '/TaxInvestmentRebateArea/DeleteTaxInvestmentRebateArea/';
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(JsonData) {
            if (JsonData == "0") {
                Message.Error("delete");
            }
            else {
                Message.Success("delete");
                Manager.GetDataForTable(1);
                //Manager.Reset();
            }
        }
        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    GetDataForTable: function (refresh) {
        var jsonParam = '';
        var serviceURL = "/TaxInvestmentRebateArea/GetTaxInvestmentRebateAreaList/";
        AjaxManager.SendJsonAsyncON(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            Manager.LoadDataTable(jsonData, refresh);
        }
        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    LoadDataTable: function (data, refresh) {
        if (refresh == "0") {
            dTable = $('#tableElement').DataTable({
                dom: '<"col-sm-5 pad-left0 margin-bottom5"B><"col-sm-4 margin-bottom5 "l><"col-sm-3 p0 margin-bottom5"f>rtip',
                initComplete: function () {
                    $("#tableElement").parent().css({
                        'background': '#fff',
                        //'minHeight': '450px',
                        'borderLeft': '1px solid #dddddd',
                        'borderRight': '1px solid #dddddd',
                        'borderBottom': '1px solid #dddddd'
                    });
                    $('#tableElement_length').css({ 'float': 'right' });
                },
                buttons: [

                     {
                         text: '<i class="fas fa-plus-square "></i> Add New Tax Investment Rebate Area',
                         className: 'btn-success',
                         action: function (e, bt, node, config) {
                             $('#frmModal').modal('show');

                             Manager.Reset();
                             $("#btnEdit").hide();
                             $("#btnSave").show();

                         }
                     },
                        {
                            text: '<i class="far fa-file-excel"></i> Excel',
                            className: 'btn-primary',
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: [0, 1]
                            },
                            title: 'Tax Investment Rebate Area'
                        }
                ],

                scrollY: "450px",
                scrollX: true,
                scrollCollapse: true,
                lengthMenu: [[50, 100, 500, -1], [50, 100, 500, "All"]],
                columnDefs: [
                    { visible: false, targets: [] },
                    { "className": "dt-center", "targets": [] }
                ],
                columns: [

                    {
                        data: 'Name',
                        name: 'Name',
                        title: 'Name'
                    },
                    {
                        data: 'Remarks',
                        name: 'Remarks',
                        title: 'Remarks'

                    },
                    {
                        data: 'Status',
                        name: 'Status',
                        title: 'Status',
                        width: 130,
                        render: function (data, type, row) {
                            return data == true ? "Yes" : "No";
                        }
                    },
                    {
                        name: 'Option',
                        title: 'Option', width: 50,
                        render: function (data, type, row) {
                            var deleteBtn = '';
                            if ($("#btnDelete").length > 0) {
                                deleteBtn = '<span class="glyphicon glyphicon-trash spnDataTableDelete" title="Click to delete"></span>';
                            }
                            return '<span class="glyphicon glyphicon-edit spnDataTableEdit" title="Edit"></span>' + deleteBtn;
                        }
                    }

                ],
                fixedColumns: true,
                data: data
            });
        } else {
            dTable.clear().rows.add(data).draw();
        }
    },
    Reset: function () {
        $("#TaxInvestmentRebateAreaFormId")[0].reset();
    }

}

$(document).on('click', '.spnDataTableEdit', function () {
    var rowData = dTable.row($(this).parent()).data();
    var status = rowData.Status;
    id = rowData.Id;
    $('#Name').val(rowData.Name);
    $('#Remarks').val(rowData.Remarks);
    //$('#Status').val(rowData.Status);

    if (status == 1) {
        $('#Status').prop('checked', true);
    } else {
        $('#Status').prop('checked', false);
    }

    $("#btnEdit").show();
    $("#btnSave").hide();
    $("#frmModal").modal('show');
});

$(document).on('click', '.spnDataTableDelete', function () {
    id = dTable.row($(this).parent()).data().Id;
    Manager.Delete(id);
});