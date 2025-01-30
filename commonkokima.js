      // タブ切り替えの処理
      function switchTab(contentId, event) {
        id = contentId;
        if (id == "ctable-container") {
            createTablePage()
        }
        else if (id == "edit-container") {
            populateTable(contentId)
        }
        else {
            updateChart(allData);
        }
        // すべてのコンテンツを非表示にする
        document.querySelectorAll('.chart-container, .table-container, .edit-container').forEach(content => {
            content.classList.remove('active-content');
        });

        // 選択されたコンテンツを表示する
        document.getElementById(contentId).classList.add('active-content');

        // タブのアクティブ状態を変更する
        const buttons = document.querySelectorAll('.tab-bar button');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
      }
    
      $(".datepicker2").datepicker({
        dateFormat: "yy-mm-dd"
    });

    $("#date").datepicker({
        dateFormat: "yy-mm-dd"
    });


    $("#add-time").timepicker({
        timeFormat: 'H:i',
        interval: 30,
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });

    const getAccessObj = (data) => {
        return {
            url: API_URL,
            type: "POST",
            dataType: "json",
            data: JSON.stringify(data),
            timeout: 30000,
        }
    }

    function loadData(idToken,type) {
        $(".loader").show();
        $.ajax(
            getAccessObj({
                path: type,
                method: "get",
                idToken: idToken
            })
        ).done(function (response) {
            $(".loader").hide();
            if (response.statusCode === 401) {
                liff.logout();
                window.location.reload();
            } else if (response.statusCode !== 200) {
                console.error(response.message);
                alert(response.message)
            } else {

                allData = response.data.items
                updateChart(response.data.items); // チャートとテーブルを更新

                return response.data.items
            }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Network error!");
        });
    }

    function changeLanguage(lang) {
        const knownLang = ["ja", "en"];
        lang = knownLang.includes(lang) ? lang : "en";

        $.getJSON("lang.json", (data) => {
            $.each(data, function (index, val) {
                const elm = $("." + val.class);
                if (elm.length) {
                    if (val.type === "docs") {
                        elm.html(val[lang]);
                    }
                }
            });
        });
    }

    function addData(data,type) {
//function setWeight(data) {
    $(".loader").show();
    $.ajax(
        getAccessObj({
            path: type,
            method: "post",
            idToken: token,
            postData:data
        })
    ).done(function (response) {
        if (response.statusCode === 401) {
            liff.logout();
            window.location.reload();
        } else if (response.statusCode !== 200) {
            console.error(response.message);
            alert(response.message)
        } else {
            allData.push(data)

            updateChart(allData); // グラフを更新
            createTablePage(); // テーブルを更新
            populateTable("edit-container");
            $(".loader").hide();
        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        $(".loader").hide();
        alert("Network error!");
    });
    }

    function deleteData(_data,type) {
        $(".loader").show();
        $.ajax(
            getAccessObj({
                path: type,
                method: "delete",
                idToken: token,
                postData: _data
            })
        ).done(function (response) {
            if (response.statusCode === 401) {
                liff.logout();
                window.location.reload();
            } else if (response.statusCode !== 200) {
                console.error(response.message);
                alert(response.message)
            } else {
                setallData()
                $(".loader").hide();
            }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            $(".loader").hide();
            alert("Network error!");

        });
    }

async function handleUpdate(olddata, newdata, type) {
    deleteData(olddata, type)
        .then(
            addData(newdata, type)
        
        )
}
    
