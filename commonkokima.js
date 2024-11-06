      // タブ切り替えの処理
      function switchTab(contentId, event) {
        id = contentId;
        if (contentId != "chart-container") {
            populateTable(contentId)
        } else {
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
