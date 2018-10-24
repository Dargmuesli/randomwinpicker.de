import { alert } from './alert';
import { assignSouvenir, assignStatTrak } from './filetree';
import { changeLanguage } from './language';
import { htmlspecialchars_decode } from './phpin';
import { i18n } from './language';

// Save the amount of tablerows
export let count;
let editing = false;
let resetting = false;
export let tableLoading = false;

let type = window.location.href.substring(0, window.location.href.length - 1);
type = type.substr(type.lastIndexOf('/') + 1);

let xhr = new XMLHttpRequest();

xhr.open('GET', '/resources/dargmuesli/table.php?type=' + type, true);
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        count = xhr.responseText;
    }
};
xhr.send();


export function sendRow(tableInputCount, uniques, type) {
    let tableInputs = new Object();

    for (let i = 0; i < tableInputCount; i++) {
        tableInputs['tableInput' + i] = document.getElementById('tableInput' + i).value;
    }

    addRow(document.getElementsByTagName('tbody')[0], document.getElementsByClassName('data'), uniques, tableInputs, type);
}

export function addRow(tbody, data, uniques, tableInputs, type) {
    if ((tableInputs['tableInput0'] != '') && ((/^\d+$/.test(tableInputs['tableInput0'])) || (/^\d+$/.test(tableInputs['tableInput1'])))) { //Wenn Text und Nummer valide sind
        let alreadyExisting = false;
        let error;
        let value;

        if (count == 0) { //Wenn keine Daten
            document.getElementById('tr0').remove(); //Platzhalter entfernen
        } else { //Wenn Daten vorhanden
            outer:
            for (let i = 0; i < count; i++) {//Zeilen durchlaufen
                for (let j = uniques[0]; j < Object.keys(tableInputs).length; j += uniques[j + 1] - uniques[j]) { //Spalten durchlaufen
                    if (htmlspecialchars_decode(tableInputs['tableInput' + j]) == htmlspecialchars_decode(data[i * Object.keys(tableInputs).length + j].innerHTML)) {
                        //.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ').trim()
                        alreadyExisting = true; //Vorkommnis merken
                        error = (i + 1) + '|' + (j + 1); //Vorkommnis markieren
                        value = tableInputs['tableInput' + j]; //Vorkommnis speichern
                        break outer; //Abbrechen
                    }
                }
            }
        }

        if (alreadyExisting == false) { //Bei keinen Duplikaten
            count++; //Zähler erhöhen

            let newElement = '';
            // let oldElement = '';

            newElement += '<td class="data">';
            newElement += tableInputs['tableInput0'];
            newElement += '</td>';
            newElement += '<td class="data">';

            if (checkAbsolute()) { //Bei generischer Tabelle
                newElement += tableInputs['tableInput1'];
                if (count == 1) { //Bei erstem Element
                    newElement += '<figure class="item" id="selected">';
                } else { //Wenn nicht erstes Element
                    newElement += '<figure class="item">';
                }
                newElement += '<img>';
                newElement += '---';
                newElement += '<br>';
                newElement += '<figcaption>';
                newElement += '<span>';
                newElement += '</span>';
                newElement += '<span>';
                newElement += '</span>';
                newElement += '</figcaption>';
                newElement += '</figure>';
                newElement += '</a>';
            } else {
                //newElement += '<span>';
                newElement += tableInputs['tableInput1'];
                //newElement += '</span>';
            }

            newElement += '</td>';
            newElement += '<td class="remove">';
            newElement += '<button class="link" title="Remove" id="rR(' + count + ', ' + Object.keys(tableInputs).length + ', \'' + type + '\')">'; // onclick="removeRow(' + count + ', ' + Object.keys(tableInputs).length + ', \'' + type + '\')"
            newElement += 'X';
            newElement += '</button>';
            newElement += '</td>';
            newElement += '<td class="up">';

            if (count != 1) { //Wenn nicht erstes Element
                newElement += '<button class="link" title="Up" id="mRU(' + count + ', ' + Object.keys(tableInputs).length + ', \'' + type + '\')">'; // onclick="moveRowUp(' + count + ', ' + Object.keys(tableInputs).length + ', \'' + type + '\')"
                newElement += '&#x25B2;';
                newElement += '</button>';
            }

            newElement += '</td>';
            newElement += '<td class="down">';
            newElement += '</td>';

            let tr = document.createElement('tr');
            tr.id = 'tr' + count;
            tr.innerHTML = newElement;
            tbody.appendChild(tr); //Neues Element erstellen

            // Make links clickable
            (function () {
                let tmp = count;
                document.getElementById('rR(' + count + ', ' + Object.keys(tableInputs).length + ', \'' + type + '\')').addEventListener('click', function () { removeRow(tmp, Object.keys(tableInputs).length, type); }); //parseInt(this.id.substring(3, this.id.length - 7 - Object.keys(tableInputs).length.toString().length - type.length))
            }());

            if (count != 1) { //Wenn nicht erstes Element
                (function () {
                    let tmp = count;
                    document.getElementById('mRU(' + count + ', ' + Object.keys(tableInputs).length + ', \'' + type + '\')').addEventListener('click', function () { moveRowUp(tmp, Object.keys(tableInputs).length, type); });
                }());

                let button = document.createElement('button');
                button.setAttribute('class', 'link');
                button.setAttribute('title', 'Down');
                button.setAttribute('id', 'mRD(' + (count - 1) + ', ' + Object.keys(tableInputs).length + ', \'' + type + '\')');
                button.innerHTML = '&#x25BC;';
                document.getElementsByClassName('down')[count - 2].appendChild(button); //Vorherigem Element Steuerelement hinzufügen

                //document.getElementsByClassName('down')[count - 2].innerHTML += oldElement; //Vorherigem Element Steuerelement hinzufügen
                (function () {
                    let tmp = count;
                    document.getElementById('mRD(' + (count - 1) + ', ' + Object.keys(tableInputs).length + ', \'' + type + '\')').addEventListener('click', function () { moveRowDown((tmp - 1), Object.keys(tableInputs).length, type); });
                }());
            }

            if (checkAbsolute()) { //Bei generischer Tabelle
                (function () {
                    let tmp = document.getElementsByClassName('item').length - 1;
                    document.getElementById('sI(' + tmp + ')').addEventListener('click', function () { selectItem(tmp); });
                }());
                document.getElementById('tableInput0').value = parseInt(document.getElementById('tableInput0').value) + 1; //Nummer erhöhen
                document.getElementById('tableInput1').value = '<button class="link" title="Win" id="sI(' + document.getElementsByClassName('item').length + ')">'; //Event aktualisieren  onclick="selectItem(' + document.getElementsByClassName('item').length + ')"

                if (count != 1) {
                    selectItem(document.querySelectorAll('.item').length - 1); //Neues Element auswählen
                }
            } else { //Bei benutzerdefinierter Tabelle
                document.getElementById('tableInput0').value = ''; //Eingabefeld zurücksetzen
                document.getElementById('tableInput1').value = 1; //Eingabefeld zurücksetzen
                document.getElementById('tableInput0').focus(); //Eingabefeld selektieren
            }
        } else { //Bei Duplikat
            alert(i18n.t('functions:table.add.duplicate', { value: value, error: error })); //Fehler ausgeben
        }

        if (!editing) {
            saveTableCreate(Object.keys(tableInputs).length, type, tbody); //Speichern
        }
    }
}

export function removeRow(ID, tableInputs, type) {
    let tbody = document.getElementsByTagName('tbody')[0];

    if (count > 1) { //Wenn mehr als ein Element
        if (ID == count) { //Wenn letztes Element
            document.getElementsByClassName('down')[count - 2].innerHTML = ''; //Voriges Down entfernen
        } else { //Wenn nicht letztes Element
            if (ID == 1) { //Wenn erstes Element
                document.getElementsByClassName('up')[ID].innerHTML = ''; //Nächstes Up entfernen
            }

            for (let j = ID + 1; j <= count; j++) { //Restliche Elemente durchlaufen
                (function () {
                    let jCopy = j;
                    let currentElement = document.getElementById('tr' + jCopy);
                    let el2 = getChildNode(getChildNode(currentElement, 2), 0), el2Clone = el2.cloneNode(true);

                    el2.parentNode.replaceChild(el2Clone, el2);
                    el2Clone.id = 'rR(' + (jCopy - 1) + ', ' + tableInputs + ', \'' + type + '\')'; //ID aufrücken
                    el2Clone.addEventListener('click', function () { removeRow((jCopy - 1), tableInputs, type); }); //Eventlistener aufrücken

                    if (jCopy != 2) { //Wenn nicht zweites Element
                        let el3 = getChildNode(getChildNode(currentElement, 3), 0), el3Clone = el3.cloneNode(true);

                        el3.parentNode.replaceChild(el3Clone, el3);
                        el3Clone.id = 'mRU(' + (jCopy - 1) + ', ' + tableInputs + ', \'' + type + '\')'; //ID aufrücken
                        el3Clone.addEventListener('click', function () { moveRowUp((jCopy - 1), tableInputs, type); }); //Eventlistener aufrücken
                    }

                    if (jCopy != count) { //Wenn nicht letztes Element
                        let el4 = getChildNode(getChildNode(currentElement, 4), 0), el4Clone = el4.cloneNode(true);

                        el4.parentNode.replaceChild(el4Clone, el4);
                        el4Clone.id = 'mRD(' + (jCopy - 1) + ', ' + tableInputs + ', \'' + type + '\')'; //ID aufrücken
                        el4Clone.addEventListener('click', function () { moveRowDown((jCopy - 1), tableInputs, type); }); //Eventlistener aufrücken
                    }

                    document.getElementById('tr' + jCopy).id = 'tr' + (jCopy - 1); //ID aufrücken

                    if (checkAbsolute()) { //Bei generischer Tabelle
                        getChildNode(currentElement, 0).innerHTML = jCopy - 1; //Nummer verringern
                    }
                }());
            }
        }
    }

    count--; //Anzahl verringern

    document.getElementById('tr' + ID).remove(); //Selbes Element entfernen

    if (checkAbsolute()) { //Bei generischer Tabelle
        let items = document.getElementsByClassName('item');

        for (let i = 0; i < document.querySelectorAll('.item').length; i++) {
            (function () {
                let iCopy = i;
                let el = items[i].parentNode, elClone = el.cloneNode(true);

                el.parentNode.replaceChild(elClone, el);
                elClone.id = 'sI(' + i + ')'; //ID aufrücken
                elClone.addEventListener('click', function () { selectItem(iCopy); }); //Eventlistener aufrücken
            }());
        }

        if (document.querySelectorAll('.item').length > 0) {
            let selected = document.getElementById('selected');

            if (selected != null) {
                selected.id = '';
            }

            items[0].id = 'selected';
        }

        document.getElementById('tableInput0').value = (count + 1); //Nummer verringern
        /*!*/        document.getElementById('tableInput1').value = '<button class="link" title="Win" id="sI(' + document.getElementsByClassName('item').length + ')">'; //Event aktualisieren  onclick="selectItem(' + document.getElementsByClassName('item').length + ')"
    }

    if (count == 0) { //Wenn Tabelle leer
        tbody.innerHTML += '<tr id="tr0"><td class="data">---</td><td class="data">---</td><td>---</td><td>---</td><td>---</td></tr>'; //Platzhalter einfügen

        if (checkAbsolute()) { //Bei generischer Tabelle
            document.getElementById('add').click(); //Neue Zeile hinzufügen
        }
    }

    if (!editing) {
        saveTableCreate(tableInputs, type, tbody); //Tabelle Speichern
    }
}

export function reset(tableInputs, type) {
    editing = true;
    resetting = true;

    for (let i = count; i > 0; i--) { //Zeilen durchlaufen
        if (i == 1) {
            editing = false;
        }

        removeRow(i, tableInputs, type); //Zeile löschen
    }
}

export function moveRowDown(ID, tableInputs, type) {
    let uppertableInput1, lowertableInput1;

    if (!checkAbsolute()) { //Bei nicht generischer Tabelle
        let uppertableInput0 = getChildNode(document.getElementById('tr' + ID), 0).innerHTML;
        let lowertableInput0 = getChildNode(document.getElementById('tr' + (ID + 1)), 0).innerHTML;

        uppertableInput1 = getChildNode(getChildNode(document.getElementById('tr' + ID), 1), 0).textContent;
        lowertableInput1 = getChildNode(getChildNode(document.getElementById('tr' + (ID + 1)), 1), 0).textContent;

        getChildNode(document.getElementById('tr' + ID), 0).innerHTML = lowertableInput0; //HTML der nächsten Zeile übernehmen
        getChildNode(document.getElementById('tr' + (ID + 1)), 0).innerHTML = uppertableInput0; //HTML der vorigen Zeile übernehmen

        getChildNode(getChildNode(document.getElementById('tr' + ID), 1), 0).textContent = lowertableInput1; //HTML der nächsten Zeile übernehmen
        getChildNode(getChildNode(document.getElementById('tr' + (ID + 1)), 1), 0).textContent = uppertableInput1; //HTML der vorigen Zeile übernehmen
    } else {
        uppertableInput1 = getChildNode(getChildNode(document.getElementById('tr' + ID), 1), 0).innerHTML;
        lowertableInput1 = getChildNode(getChildNode(document.getElementById('tr' + (ID + 1)), 1), 0).innerHTML;

        getChildNode(getChildNode(document.getElementById('tr' + ID), 1), 0).innerHTML = lowertableInput1; //HTML der nächsten Zeile übernehmen
        getChildNode(getChildNode(document.getElementById('tr' + (ID + 1)), 1), 0).innerHTML = uppertableInput1; //HTML der vorigen Zeile übernehmen
    }

    saveTableCreate(tableInputs, type, document.getElementById('tr' + ID).parentNode); //Tabelle Speichern
}

export function moveRowUp(ID, tableInputs, type) {
    let uppertableInput0, lowertableInput0, uppertableInput1, lowertableInput1;

    if (!checkAbsolute()) { //Bei nicht generischer Tabelle
        uppertableInput0 = getChildNode(document.getElementById('tr' + (ID - 1)), 0).innerHTML;
        lowertableInput0 = getChildNode(document.getElementById('tr' + ID), 0).innerHTML;

        uppertableInput1 = getChildNode(getChildNode(document.getElementById('tr' + (ID - 1)), 1), 0).textContent;
        lowertableInput1 = getChildNode(getChildNode(document.getElementById('tr' + ID), 1), 0).textContent;

        getChildNode(document.getElementById('tr' + (ID - 1)), 0).innerHTML = lowertableInput0; //HTML der nächsten Zeile übernehmen
        getChildNode(document.getElementById('tr' + ID), 0).innerHTML = uppertableInput0; //HTML der vorigen Zeile übernehmen

        getChildNode(getChildNode(document.getElementById('tr' + (ID - 1)), 1), 0).textContent = lowertableInput1; //HTML der nächsten Zeile übernehmen
        getChildNode(getChildNode(document.getElementById('tr' + ID), 1), 0).textContent = uppertableInput1; //HTML der vorigen Zeile übernehmen
    } else {
        uppertableInput1 = getChildNode(getChildNode(document.getElementById('tr' + (ID - 1)), 1), 0).innerHTML;
        lowertableInput1 = getChildNode(getChildNode(document.getElementById('tr' + ID), 1), 0).innerHTML;

        getChildNode(getChildNode(document.getElementById('tr' + (ID - 1)), 1), 0).innerHTML = lowertableInput1; //HTML der nächsten Zeile übernehmen
        getChildNode(getChildNode(document.getElementById('tr' + ID), 1), 0).innerHTML = uppertableInput1; //HTML der vorigen Zeile übernehmen
    }

    saveTableCreate(tableInputs, type, document.getElementById('tr' + ID).parentNode); //Tabelle Speichern
}

export function saveTableCreate(columnCount, type, object) {
    let main = document.getElementsByTagName('main')[0];

    main.style.cursor = 'progress';
    object.style.opacity = '0.1';

    saveTableSend(columnCount, type, object, main); //setTimeout(function() {saveTableSend(columnCount, type, object, main)}, 10);
}

export function saveTableSend(columnCount, type, object, main) {
    let content = [];

    for (let i = 1; i <= count; i++) { //Zeilen durchlaufen
        content[i - 1] = new Object(); //Neues Objekt anlegen

        let j;

        for (j = 0; j < columnCount; j++) { //Eigenschaften durchlaufen
            content[i - 1]['column' + j] = getChildNode(document.getElementById('tr' + i), j).innerHTML.trim(); //Wert kopieren
        }

        content[i - 1]['column' + (j - 1) + 'classes'] = getChildNode(document.getElementById('tr' + i), (j - 1)).className; //Klasse kopieren
    }

    if (content.length == 0) { //Wenn kein Inhalt
        content = null; //Inhalt leer setzen
    }

    content = encodeURIComponent(JSON.stringify(content)); //.replace('/&/g', '%26');

    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/resources/dargmuesli/save.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // if (languageChanging) {
            //     languageChanging = false;

            //     changeLanguage('en');
            //     // changeLanguage('de');
            // }

            if (xhr.responseText == 'NULL\n' && resetting == false) {
                changeLanguage('de');
                alert(i18n.t('functions:table.save.error'));
            }

            resetting = false;

            main.style.cursor = 'auto';
            object.style.opacity = '1';
        }
    };
    xhr.send('content=' + content + '&type=' + type);
}

export function selectItem(index) {
    let selected = document.getElementById('selected');

    if ((tableLoading == false) && (selected.parentNode.id == 'sI(' + index + ')') && (selected.innerHTML != '<img>---<br><figcaption><span></span><span></span></figcaption>')) { //Wenn selbes Element
        let file = selected.firstChild.className.substring(4);

        alert.render(i18n.t('functions:table.select.title'), i18n.t('functions:table.select.question'), file, 'delete');
    } else {
        tableLoading = false;

        selected.removeAttribute('id'); //Auswahl entfernen
        document.getElementsByTagName('figure')[index].setAttribute('id', 'selected'); //Auswählen
        selected = document.getElementById('selected'); //Variable akualisieren

        let span1 = selected.getElementsByTagName('span')[0];
        let span2 = selected.getElementsByTagName('span')[1];
        let condition = document.getElementById('condition');
        let type = document.getElementById('chkType');

        if (type != null) {
            if (selected.innerHTML == '<img>---<br><figcaption><span></span><span></span></figcaption>') {
                condition.selectedIndex = 0; //'---' auswählen
                condition.disabled = true;
                type.parentNode.style.display = 'none';
                document.getElementById('hType').style.display = 'none';
            } else {
                condition.disabled = false;

                let notes = '';

                for (let i = 0; i < selected.childNodes[1].childNodes.length; i++) {
                    if (selected.childNodes[1].childNodes[i].className == 'Normal' || selected.childNodes[1].childNodes[i].className == 'StatTrak' || selected.childNodes[1].childNodes[i].className == 'Souvenir') {
                        notes = selected.childNodes[1].childNodes[i];
                        break;
                    }
                }

                if (notes.className == 'StatTrak') {
                    document.getElementById('hType').style.display = 'block';
                    type.parentNode.style.display = 'initial';
                    type.parentNode.innerHTML = '<input type="checkbox" name="type" value="StatTrak&trade;" id="chkType"> StatTrak&trade;'; // onclick="assignStatTrak();"
                    document.getElementById('chkType').addEventListener('click', function () { assignStatTrak(); });
                    type = document.getElementById('chkType');
                } else if (notes.className == 'Souvenir') {
                    document.getElementById('hType').style.display = 'block';
                    type.parentNode.style.display = 'initial';
                    type.parentNode.innerHTML = '<input type="checkbox" name="type" value="Souvenir" id="chkType"> Souvenir'; // onclick="assignSouvenir();"
                    document.getElementById('chkType').addEventListener('click', function () { assignSouvenir(); });
                    type = document.getElementById('chkType');
                } else {
                    type.parentNode.style.display = 'none';
                    document.getElementById('hType').style.display = 'none';
                }

                if (span1.innerHTML == '') {
                    //Wenn kein Tag
                    condition.selectedIndex = 0; //'---' auswählen
                } else if (span1.innerHTML == '[FN]') {
                    //Wenn Tag 'Factory New'
                    condition.selectedIndex = 1; //'Factory New' auswählen
                } else if (span1.innerHTML == '[MG]' || span1.innerHTML == '[MW]') {
                    //Wenn Tag 'Minimal Wear'
                    condition.selectedIndex = 2; //'Minimal Wear' auswählen
                } else if (span1.innerHTML == '[EE]' || span1.innerHTML == '[FT]') {
                    //Wenn Tag 'Field-Tested'
                    condition.selectedIndex = 3; //'Field-Tested' auswählen
                } else if (span1.innerHTML == '[AG]' || span1.innerHTML == '[WW]') {
                    //Wenn Tag 'Well-Worn'
                    condition.selectedIndex = 4; //'Well-Worn' auswählen
                } else if (span1.innerHTML == '[KS]' || span1.innerHTML == '[BS]') {
                    //Wenn Tag 'Battle-Scarred'
                    condition.selectedIndex = 5; //'Battle-Scarred' auswählen
                }

                if (span2.innerHTML == '') {
                    //Wenn kein Tag
                    type.checked = false; //Haken entfernen
                } else {
                    //Wenn Tag 'StatTrak' oder 'Souvenir'
                    type.checked = true; //Haken setzen
                }
            }
        }

        if (selected.firstChild.style.display == 'none') {
            document.getElementById('hideimages').innerHTML = 'Show all images';
        }
    }
}

export function checkAbsolute() {
    if (document.getElementById('tableInput0').classList.contains('absolute')) { //Bei generischer Tabelle
        return true;
    } else { //Wenn Tabelle benutzerdefiniert ist
        return false;
    }
}

export function getFirstChild(el) {
    let firstChild = el.firstChild;

    while (firstChild != null && firstChild.nodeType == 3) {
        firstChild = firstChild.nextSibling;
    }

    return firstChild;
}

export function getLastChild(el) {
    let lastChild = el.lastChild;

    while (lastChild != null && lastChild.nodeType == 3) {
        lastChild = lastChild.previousSibling;
    }

    return lastChild;
}

export function getChildNode(el, i) {
    let j = 0;
    let childNode = el.childNodes[j];

    while (j <= i) {
        while (childNode != null && childNode.nodeType == 3 && !isNumeric(childNode.textContent)) {
            childNode = childNode.nextSibling;
        }

        j++;

        if (j <= i) {
            childNode = childNode.nextSibling;
        }
    }

    return childNode;
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
