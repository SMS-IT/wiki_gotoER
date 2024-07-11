<?php


class SmsMetasHooks
{
    public static $meta_count = 0;

    // MediaWiki URL
    // for example, https://wiki.ru/index.php/
    public static $wiki_url = "";

    # Setup the AnyWikDraw parser function
    public static function efSmsMetasParserFirstCallInit(Parser &$parser)
    {
        $parser->setHook('smsmeta', array('SmsMetasHooks', 'smsMetasParserHookTag'));
        return true;
    }

    // xml tag <smsmeta db="xxx.yyy">frame</smsmeta>
    public static function smsMetasParserHookTag($text, $args, $parser)
    {
        $parser->disableCache();
        $isProtected = $parser->getTitle()->isProtected();

        $title = explode('/', $parser->getTitle())[0];
        $out = "";

        $action = isset($_POST['action']) ? $_POST['action'] : "";
        if ($action == 'parse') {
            return $text;
        }

        $hideall = true;
        $skip = false;

        $internalout = $parser->internalParse($text);
        $tagClass = "";
        $commonClass = "smsmetas";

        $tagName = "span";
        if (strpos($internalout, "\n") !== false) {
            $tagName = "div";
            $commonClass = "smsmetas-right";
        }

        if ($tagName == "div") {
            if ($args["history"] == "" && $args["db"] == "") {
                $tagClass = "smsmetas-db-right";
            }
        } else {
            if ($args["history"] == "" && $args["db"] == "") {
                $tagClass = "smsmetas-db";
            }
        }
        $commonClass .= " " . $tagClass;

        $contentClass = "smsmetas-content";
        if ($internalout == "") {
            $contentClass = "smsmetas-content-empty";
        }

        $img_src = isset($args["db"]) ? "/skins/common/images/database-svgrepo-com.svg" : "/skins/common/images/lamp-svgrepo-com.svg";
        $iconSmsmetas = "<a class='smsmetas-a' href='#' metatitle='" . $internalout . "'  onclick='return false;'><img class='smsmetas-lamp-icon' src='" . $img_src . "'></a>";
        $content = "<" . $tagName . " class='" . $commonClass . "'><" . $tagName . " class='" . $contentClass . "'>" . $internalout . "</" . $tagName . "></" . $tagName . ">";

        if (isset($args["history"])) {
            if (isset($_GET['smsmetashistory']) && !$skip) {
                if ($_GET['smsmetashistory'] == "1") {
                    $out .= $content;
                } else $out .= $iconSmsmetas;
                $skip = true;
            }
        }

        if (isset($args["db"])) {
            $content = "<a href='" . self::$wiki_url . $title . "/_ER#searchdb=" . $internalout . "' target='_blank'>" . $content . "</a>";
            if (isset($_GET['smsmetasdb']) && !$skip) {
                if ($_GET['smsmetasdb'] == "1") {
                    $out .= $content;
                } else $out .= $iconSmsmetas;
                $skip = true;
            }
        }

        if (isset($_GET['smsmetas'])) {
            if ($_GET['smsmetas'] == "1") {
                $hideall = false;
            }
        }

        self::$meta_count += 1;
        if (!$skip) $out .= $hideall ? $iconSmsmetas : $content;
        $return = array($out, 'isHTML' => true);
        return $out;
    }

    public static function contentHook($skin, array &$content_actions)
    {
        global $wgRequest, $wgUser;
        return true;
    }

    public static function SmsMetasFilter_BeforeHTML(&$out, &$text)
    {
        global $wgTitle, $wgUser;
        $link = self::$wiki_url . explode('/', $wgTitle)[0] . "/_ER";
        $text3 = "<script>
            var smsMetasErModelLink = '" . $link . "'
            $(window).load(function() {
            var urlSearchParams = new URLSearchParams(window.location.hash.replace('#', ''));
            var smsmetasParams = Object.fromEntries(urlSearchParams.entries());
            if (Object.keys(smsmetasParams).includes('searchdb')) {
                var table = smsmetasParams['searchdb'].split('.')[0];
                var groupElem = null;
                var selectedSvg = null
                for (let svgObject of $('object')) {
                    let svg = svgObject.contentDocument.querySelectorAll('svg')[0];
                    let mbElems = [];
                    for (let font of svg.querySelectorAll('font')) {
                        if (font.innerText == table) {
                            if (font.parentElement.children.length === 3 || font.parentElement.children.length === 1) mbElems.push(font);
                        }
                    }
                    for (let font of mbElems) {
                        var parent = font.parentElement;
                        while (parent.tagName != 'g') {
                            parent = parent.parentElement;
                        }
            
                        if (parent.parentElement && parent.parentElement.previousElementSibling && parent.tagName == 'g' && parent.parentElement.tagName == 'g'
                            && parent.parentElement.previousElementSibling.tagName == 'g' && parent.parentElement.previousElementSibling.children.length == 3) {
                            for (let child of parent.parentElement.previousElementSibling.children) {
                                if (child.getAttribute('fill') != '#f5f5f5' && child.getAttribute('fill') != '#ffffff' && child.getAttribute('fill') != 'none') {
                                    groupElem = parent.parentElement.previousElementSibling;
                                    selectedSvg = svgObject.contentDocument;
                                    break;
                                }
                            }
                        } else if (parent && parent.previousElementSibling && parent.tagName == 'g' && parent.parentElement.tagName == 'g' && parent.previousElementSibling.tagName == 'path'
                            && parent.previousElementSibling.previousElementSibling && parent.previousElementSibling.previousElementSibling.tagName == 'path') {
                            let fill = parent.previousElementSibling.previousElementSibling.previousElementSibling.getAttribute('fill');
                            if (parent.previousElementSibling.previousElementSibling.previousElementSibling && parent.previousElementSibling.previousElementSibling.previousElementSibling.tagName == 'path'
                                && fill != '#f5f5f5' && fill != '#ffffff' && fill != 'none') {
                                groupElem = parent.previousElementSibling.previousElementSibling;
                                selectedSvg = svgObject.contentDocument;
                            }
                        }
                    }
                }
                let targetField = null;
                if (selectedSvg != null) {
                    let divElems = [];
                    let field = smsmetasParams['searchdb'].split('.')[1];
                    for (let div of selectedSvg.querySelectorAll('div')) {
                        let text = div.innerText.replace(/\\n/g, '');
                        if ((text == field && div.children.length == 0) || (text == field && div.children.length == 1 && div.children[0].tagName == 'br')) {
                            divElems.push(div);
                        }
            
                    }
                    let groupElemPos = groupElem.getBoundingClientRect();
                    for (let div of divElems) {
                        var parent = div.parentElement;
                        while (parent.tagName != 'g') {
                            parent = parent.parentElement;
                        }
            
                        if (parent.parentElement && parent.parentElement.previousElementSibling && parent.parentElement.previousElementSibling.children.length == 2 && groupElem.tagName == 'g') {
                            for (let child of parent.parentElement.previousElementSibling.children) {
                                let elem = parent.parentElement.previousElementSibling.children[0];
                                let pos1 = elem.getBoundingClientRect();
                                if (pos1.top >= groupElemPos.top && pos1.bottom <= groupElemPos.bottom && pos1.left >= groupElemPos.left && pos1.right <= groupElemPos.right) {
                                    targetField = elem;
                                    break;
                                }
                            }
                        } else if (groupElem.tagName == 'path') {
                            if (parent.previousElementSibling && parent.previousElementSibling.tagName == 'path'
                                && parent.previousElementSibling.previousElementSibling && parent.previousElementSibling.previousElementSibling.tagName == 'rect') {
                                let pos1 = parent.previousElementSibling.previousElementSibling.getBoundingClientRect();
                                if (pos1.top >= groupElemPos.top && pos1.bottom <= groupElemPos.bottom && pos1.left >= groupElemPos.left && pos1.right <= groupElemPos.right) {
                                    targetField = parent.previousElementSibling.previousElementSibling;
                                }
                            }
                        }
                    }
                }
            
                if (groupElem != null && groupElem.children && groupElem.children.length > 0 && groupElem.tagName == 'g') {
                    groupElem.children[0].setAttribute('stroke-width', '6');
                    groupElem.children[1].setAttribute('stroke-width', '6');
                    groupElem.children[0].setAttribute('stroke', 'green');
                    groupElem.children[1].setAttribute('stroke', 'green');
                } else if (groupElem != null) {
                    groupElem.setAttribute('stroke-width', '6');
                    groupElem.previousElementSibling.setAttribute('stroke-width', '6');
                    groupElem.setAttribute('stroke', 'green');
                    groupElem.previousElementSibling.setAttribute('stroke', 'green');
                }
            
                if (targetField != null) {
                    targetField.setAttribute('fill', 'ghostwhite');
                    targetField.setAttribute('stroke', 'green');
                    targetField.setAttribute('stroke-width', '3');
                    var i = 0;
                    while (i < 5) {
                        setTimeout(function () {
                            targetField.scrollIntoView({block: 'center', inline: 'center'});
                        }, i * 100);
                        i++;
                    }
                } else if (groupElem != null){
                    var i = 0;
                    while (i < 5) {
                        setTimeout(function () {
                            groupElem.scrollIntoView({block: 'start', inline: 'center'});
                        }, i * 100);
                        i++;
                    }
                }
            }

                
                $(function () {                    
                   $('a.smsmetas-a').each(function (b) {
                        if ($(this).attr('metatitle') && this.children && this.children[0].getAttribute('src') == '/skins/common/images/database-svgrepo-com.svg') {
                            var c = $(this).attr('metatitle');
                            var x = 0;
                            var y = 25;
                            $(this).click(function (d) {
                                $(this).attr('metatitle', '');
                                $('body').append('<div id=\"smsmetashint\"><a target=\"blank\"  href=\"' + smsMetasErModelLink + '#searchdb=' + c + '\">' + c + '</a></div>');
                                $('#smsmetashint').css({
                                    left: (d.pageX + x) + 'px',
                                    top: (d.pageY + y) + 'px'
                                }).show();
                                setTimeout(function(){
                                    $('#smsmetashint').remove();
                                }, 5000);
                            }).mouseover(function () {
                                c = $(this).attr('metatitle');
                                $(this).attr('metatitle', '');
                            }).mouseout(function (){
                                $(this).attr('metatitle', c);
                            })
                        } else {
                            var c = $(this).attr('metatitle');
                            var x = 0;
                            var y = 25;
                            $(this).click(function (d) {
                                try {
                                    $('#smsmetashint').remove();
                                } catch (e) {
                                  console.log(e);
                                }
                                $(this).attr('metatitle', '');
                                
                                let html = document.createRange().createContextualFragment(c);
                                html.querySelectorAll('a').forEach((anode) => {
                                    anode.target = '_blank';
                                    if (anode.href.includes('ER')) {
                                        anode.href += '?searchdb=' + anode.innerText;
                                    }
                                });
                                $('body').append('<div id=\"smsmetashint\"></div>');
                                $('#smsmetashint')[0].appendChild(html);
                                $('#smsmetashint').css({
                                    left: (d.pageX + x) + 'px',
                                    top: (d.pageY + y) + 'px'
                                }).show();
                                setTimeout(function(){
                                    $('#smsmetashint').remove();
                                }, 5000);
                            }).mouseover(function () {
                                c = $(this).attr('metatitle');
                                $(this).attr('metatitle', '');
                            }).mouseout(function (){
                                $(this).attr('metatitle', c);
                            })
                        }
                    })
                });
            })

        </script>";
        $text = $text3 . $text;

        if ($wgTitle == null) return true;
        if (isset($_GET['printable']) && $_GET["printable"] == "yes") return true;
        if (self::$meta_count == 0) return true;

        if (self::$meta_count > 0) {
            $text2 = "<script>

            var smsmetasModalDiv = document.getElementById(\"smsmetas_filter_modal\");
            if (!smsmetasModalDiv) {
            		smsmetasModalDiv = document.createElement(\"div\");
			      smsmetasModalDiv.setAttribute(\"id\", \"smsmetas_filter_modal\");
			      smsmetasModalDiv.setAttribute(\"style\", \"display: none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);\");

                var inner = \"<div style=\\\"background-color: #fefefe; margin: 15% auto; padding: 20px; border: 10px solid #2781c5; width: fit-content;\\\">\";";
            $text2 .= "
                inner += \"<div><input id=\\\"smsmetashistory\\\" type=\\\"checkbox\\\" name=\\\"smsmetashistory\\\" value=\\\"1\\\" /> <label for=\\\"smsmetashistory\\\">Показать историю</label></div>\";
                inner += \"<div><input id=\\\"smsmetasdb\\\" type=\\\"checkbox\\\" name=\\\"smsmetasdb\\\" value=\\\"1\\\" /> <label for=\\\"smsmetasdb\\\">Показать поля бд</label></div>\";
                inner += \"<div><input id=\\\"smsmetas\\\" type=\\\"checkbox\\\" name=\\\"smsmetas\\\" value=\\\"1\\\" /> <label for=\\\"smsmetas\\\">Показать все</label></div>\";";

            $text2 .= "
                inner += \"<hr style='margin: 15px 0px;'>\";
                inner += \"<br><div><button style='padding: 2px 15px;' onclick=\\\"AcceptSmsMetasModel()\\\" >Принять</button>&nbsp;&nbsp;\";
                inner += \"<button style='padding: 2px 15px;' onclick=\\\"DismissSmsMetasModal()\\\" >Отмена</button></div></div>\";
                smsmetasModalDiv.innerHTML = inner;
                var lastChild = document.body.lastChild;
                document.body.insertBefore(smsmetasModalDiv, lastChild.nextSibling);
            }";

            $text2 .= "
                 $(window).load(function() {
                        var smsmetasIconsA = $(\".smsmetas-a\");
                        for (let i =0; i < smsmetasIconsA.length; i++) {
                            smsmetasIconsA[i].title = smsmetasIconsA[i].title.replace(/<\/?[^>]+(>|$)/g, \"\");
                        }
                        var smsmetasModalDiv = document.getElementById(\"smsmetas_filter_modal\");
                        if (smsmetasModalDiv) {
                            var menuElement = document.createElement(\"li\");
                            menuElement.innerHTML = '<span><a onclick=\"OpenSmsMetasModal()\" href=\"#\" title=\"Метатеги\"><img style=\"width: 26px;margin-top:-10px;\"  src=\"/skins/common/images/lamp-svgrepo-com.svg\"</a></span>';
                            var elementBefore = document.getElementById(\"ca-watch\");
                            if (elementBefore) {
                                elementBefore.parentElement.insertBefore(menuElement, elementBefore);
                            } else {
                                elementBefore = document.getElementById(\"ca-unwatch\");
                                if (elementBefore) {
                                    elementBefore.parentElement.insertBefore(menuElement, elementBefore);
                                }
                            }
                        }
                });";

            $text2 .= "function OpenSmsMetasModal() {
                var urlSearchParams = new URLSearchParams(window.location.search);
                var smsmetasParams = Object.fromEntries(urlSearchParams.entries());
                for (let i =0; i< Object.keys(smsmetasParams).length; i++) {
                    let el = $('#smsmetas_filter_modal #' + Object.keys(smsmetasParams)[i]);
                    if (el.length == 1) {
                        el.prop('checked', true)
                    }
                }
                smsmetasModalDiv.style[\"display\"] = \"block\";
            }
            
            function DismissSmsMetasModal() {
                smsmetasModalDiv.style[\"display\"] = \"none\";
            }
            
            function AcceptSmsMetasModel() {
                var selectedMetas = [];
                $('#smsmetas_filter_modal input:checked').each(function() {
                    selectedMetas.push($(this).attr('id'));
                });
                var path = new URL(window.location.href);
                
                if (selectedMetas.includes(\"smsmetas\") && !path.searchParams.has(\"smsmetas\")) {
                    path.searchParams.append(\"smsmetas\", \"1\");
                } else {
                    for (let i=0; i< selectedMetas.length; i++) {
                        if (!path.searchParams.has(selectedMetas[i])) {
                            path.searchParams.append(selectedMetas[i], $('#smsmetas_filter_modal #' + selectedMetas[i])[0].value);
                        }
                    }
                }
                
                $('#smsmetas_filter_modal input:not(:checked)').each(function() {
                    path.searchParams.delete($(this).attr('id'));
                });
                
                smsmetasModalDiv.style[\"display\"] = \"none\";
                window.location.replace(window.location.pathname + path.search);
            }
            
            </script>";

            $text = $text2 . $text;
        }

        return true;
    }
}

?>

