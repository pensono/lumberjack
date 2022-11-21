export interface Demo {
    name: string;
    log_url: string;
    query: string
}

export let demos : Demo[] = [
    {
        name: "Web Traffic from Logs",
        // Originally from https://github.com/elastic/examples/blob/master/Common%20Data%20Formats/apache_logs/apache_logs
        log_url: "/public/examples/apache.log",
        query: `Input`
    },
    {
        name: "Chicago Traffic CSV",
        // Originally from https://data.cityofchicago.org/Transportation/Chicago-Traffic-Tracker-Historical-Congestion-Esti/kf7e-cur8
        log_url: "https://data.cityofchicago.org/resource/kf7e-cur8.csv",
        query: `Input`
    }
];

