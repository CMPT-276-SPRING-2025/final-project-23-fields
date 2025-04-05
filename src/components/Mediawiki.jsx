import { useEffect, useState } from "react";

export default function Mediawiki({searchKeyword, setSearchKeyword, articleText, setArticleText}) {
    // (String) url containing the needed parameters dependent on request
    const [url, setUrl] = useState('Waiting on Search...');

    // Base parameters
    const params = {
        action: "query",
        format: "json",
        prop: "extracts",
        titles: searchKeyword.keyword,
        utf8: "1",
        formatversion: "2",
        explaintext: "1",
        origin: "*",
        redirects: "1"
    }

}