      // タブ切り替えの処理
      function switchTab(contentId, event) {
        // 先に表示切替を行い、後段処理でエラーが起きてもタブ表示は維持する
        document.querySelectorAll('.input-container, .chart-container, .table-container, .edit-container').forEach(content => {
            content.classList.remove('active-content');
        });
        const chartContainerAll = document.getElementById('chart-container-all');
        if (chartContainerAll) {
            chartContainerAll.style.display = contentId === "chart-container" ? "block" : "none";
        }
        const nextContent = document.getElementById(contentId);
        if (nextContent) {
            nextContent.classList.add('active-content');
        }

        const buttons = document.querySelectorAll('.tab-bar button');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        }

        try {
            if (contentId === "table-container" && typeof createTablePage === "function") {
                createTablePage();
            } else if (contentId === "edit-container" && typeof populateTable === "function") {
                populateTable(contentId);
            } else if (typeof updateChart === "function") {
                updateChart(allData);
            }
        } catch (e) {
            console.error("switchTab rendering error:", e);
        }
        if (typeof updateGraphUnitButtonVisibility === "function") {
            updateGraphUnitButtonVisibility();
        }
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

    function loadData(idToken,type,postData,mergeMode) {
        $(".loader").show();
        const safePostData = postData || {};
        const safeMergeMode = mergeMode || "replace";
        return $.ajax(
            getAccessObj({
                path: type,
                method: "get",
                idToken: idToken,
                postData: safePostData
            })
        ).then(function (response) {
            if (response.statusCode === 401) {
                liff.logout();
                window.location.reload();
                return [];
            } else if (response.statusCode !== 200) {
                console.error(response.message);
                alert(response.message)
                return [];
            } else {
                const items = (response.data && Array.isArray(response.data.items)) ? response.data.items : [];
                if (safeMergeMode === "append") {
                    allData = (Array.isArray(allData) ? allData : []).concat(items);
                } else {
                    allData = items;
                }
                updateChart(allData); // チャートとテーブルを更新
                return items;
            }
        }, function () {
            alert("Network error!loadData");
            return [];
        }).always(function () {
            $(".loader").hide();
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
    return $.ajax(
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
            alert(response.message);
        } else {
            allData.push(data)
            populateTable(allData);
            updateChart(allData); // グラフを更新
            createTablePage(); // テーブルを更新
        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Network error!addData");
    }).always(function () {
        $(".loader").hide();
    });
    }

    // 血圧登録（GAS側 UserSheet.setPressure を利用）
    function setPressure(data) {
        return addData(data, "pressure");
    }

    // 血糖登録
    function setSugar(data) {
        return addData(data, "sugar");
    }

    function deleteData(_data,type) {
        $(".loader").show();
        return $.ajax(
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
                alert(response.message);
            } else {
                setallData()
            }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Network error!deleteData");
        }).always(function () {
            $(".loader").hide();
        });
    }

    async function handleUpdate(olddata, newdata, type) {
        deleteData(olddata, type)
            .then(() => addData(newdata, type)) // ここで `addData` を `then` に渡す
            .catch(error => console.error("Error:", error)); // エラーハンドリングを追加
    }
    
