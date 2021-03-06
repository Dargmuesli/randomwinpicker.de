<?php
    include_once $_SERVER['DOCUMENT_ROOT'].'/resources/dargmuesli/text/markuplanguage.php';
    include_once $_SERVER['DOCUMENT_ROOT'].'/resources/dargmuesli/url/require.php';

    function output_html($title, $description, $content, $features = [], $keywords = 'random, win, picker')
    {
        global $rootPointerInteger;
        global $directoryName;

        $featureTranslation = get_feature_translation($features);

        if (isset($_GET['errorCode'])) {
            $title = $_GET['errorCode'];
            $titleShy = $_GET['errorCode'];
        }

        $html = '
            <!DOCTYPE html>
            <html dir="ltr" lang="'.get_language().'">
                <head>
                    <meta charset="UTF-8">
                    <title>
                        '.$title.' - RandomWinPicker
                    </title>
                    <base href="';

        if (isset($_GET['errorCode'])) {
            $html .= getenv('BASE_URL').'/error/';
        }

        $html .= '">
                <link href="'.$_SERVER['SERVER_ROOT_URL'].$_SERVER['REQUEST_URI'].'" rel="canonical">
                <link href="'.getenv('BASE_URL').'/resources/dargmuesli/icons/favicon.ico" rel="icon" type="image/x-icon">
                <meta name="HTTP_X_FORWARDED_PREFIX" content="'.getenv('BASE_URL').'">
                <meta name="author" content="Jonas Thelemann" />
                <meta name="description" content="'.$description.'" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta content="'.$keywords.'" name="keywords">
                <meta property="og:description" content="'.$description.'" />
                <meta property="og:image" content="'.$_SERVER['SERVER_ROOT_URL'].'/resources/dargmuesli/icons/screenshots/welcome.jpg" />
                <meta property="og:title" content="'.$title.' - RandomWinPicker" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="'.$_SERVER['SERVER_ROOT_URL'].'" />
                <script src="https://www.google.com/recaptcha/api.js?hl='.get_language().'&amp;render=explicit" async defer></script>
                '.get_feature_translation(['drg/base/stl.mcss']).'
            </head>';

        $html .= '
                <body>
                    <noscript>
                        <iframe height="0" sandbox="" src="//www.googletagmanager.com/ns.html?id=GTM-KL6875" width="0"></iframe>
                    </noscript>
                    <div id="deprecation">';

        switch (get_language()) {
            case 'de':
                $html .= 'Diese Website wird nicht mehr entwickelt. Du siehst die zuletzt veröffentlichte Version, die geringfügige Sicherheitslücken hat.';
                break;
            default:
                $html .= 'This website is no longer developed. You\'re looking the last published version, which has minor security vulnerabilities.';
        }

        $html .= '  </div>
                    '.$content.'
                    <div id="dialogoverlay"></div>
                    <div id="dialogbox">
                        <div>
                            <div id="dialogboxhead">
                            </div>
                            <div id="dialogboxbody">
                            </div>
                            <div id="dialogboxfoot">
                            </div>
                        </div>
                    </div>
                    '.get_feature_translation(['pkg/jq/mjs', 'pkg/jqft/mjs', 'drg/gtm/mjs', 'drg/base/func.mjs'])
                    .$featureTranslation.'
                </body>
            </html>';

        echo get_indented_ml($html);
    }

    function get_footer()
    {
        $footer = '
            <footer>
                <p id="language">';

        switch (get_language()) {
            case 'de':
                $footer .= '
                    <button class="link en" id="lang" title="Switch to English">
                        <img src="'.getenv('BASE_URL').'/resources/dargmuesli/icons/en.png" alt="English Flag" id="flag">';
                break;
            default:
                $footer .= '
                    <button class="link de" id="lang" title="Switch to German">
                        <img src="'.getenv('BASE_URL').'/resources/dargmuesli/icons/de.png" alt="German Flag" id="flag">';
        }

        $footer .= '
                    </button>
                </p>
                <p class="seethrough">
                    -
                    <a href="'.getenv('BASE_URL').'/imprint/" title="Imprint">
                        '.translate('pages.general.footer.imprint').'
                    </a>
                    |
                    <button id="bug" class="link" title="Report a bug">
                        '.translate('pages.general.footer.bug-report').'
                    </button>
                    -
                </p>
            </footer>';

        return $footer;
    }
