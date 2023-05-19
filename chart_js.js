    const baseURL =
        "https://api.odcloud.kr/api/15050175/v1/uddi:fbd00f3e-ba6c-405d-9f88-ec2af2556127?serviceKey=YSkP0OIU7nmv%2BW3OU7yTxqcsTXrXHmDIScCSyHFgK%2FXn43oZxo8rptmRKaEnjJTe5uJ7RMFRSzohrR4PFzJ2bw%3D%3D&page=1&perPage=10";

    const getData = async () => {
        const res = await axios({
            method: "get",
            url: baseURL,
            headers: {
                Accept: "application/json",
            },
        })
            .then((res) => {
                console.log(res);
                return findData(res, keyOptions);
            })
            .catch((e) => {
                console.log("error!!", e);
            })
            .then((res) => {
                createChart(res); //res ==> group
            });
    };

    // 데이터에 따른 차트 생성
    function createChart(group) {
        const context = document.getElementById("my-chart");

        const chartData = {
            labels: group[0],
            datasets: [
                {
                    label: "사용된 예산",
                    data: group[1],
                    backgroundColor: [
                        "rgb(255, 99, 132)", // 1
                        "rgb(75, 192, 192)", // 2
                        "rgb(255, 205, 86)", // 3
                        "rgb(201, 203, 207)", // 4
                        "rgb(54, 162, 235)", // 5
                        "rgb(184, 248, 139)", // 6
                        "rgb(47, 34, 113)", // 7
                        "rgb(238, 53, 113)", // 8
                        "rgb(253, 136, 3)", // 9
                    ],
                    hoverBackgroundColor: ["rgb(77, 77, 77)"],
                },
            ],
        };

        const config = {
            type: "polarArea",
            data: chartData,
            options: {},
        };

        const myChart = new Chart(context, config);
    }

    // url의 params 가져옴
    let arr = [];
    let urlSearch = new URLSearchParams(location.search);
    let keyOptions = urlSearch.getAll("checkedValue");
    if (keyOptions[0]) {
        getData();
    }

    // 공공데이터 api 가져와서 params와 매치하는 데이터 출력
    function findData(result, keys) {
        //선택한 것
        let group = [];
        let labels = [];
        let datas = [];
        for (let key of keys) {
            //공공 api
            for (let dataKey of result.data.data) {
                //key 분야 datakey 는 한데이터 셋
                let index = labels.indexOf(dataKey[key]);
                //labels에 없을 경우 데이터를 넣음
                if (index == -1) {
                    //labels
                    labels.push(dataKey[key]);

                    //data
                    let sum = 0;
                    result.data.data.forEach((element) => {
                        for (let key in element) {
                            if (element[key] == dataKey[key]) {
                                sum += element["예산현액"];
                            }
                        }
                    });
                    datas.push(sum);
                }
            }
        }
        group.push(labels);
        group.push(datas);
        return group;
    }
    
