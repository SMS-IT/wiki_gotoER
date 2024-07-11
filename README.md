По умолчанию контент внутри незнакомого тега обрабатывается как текст, без его парсинга на расширения wiki (Table, Figma, References, etc.), поэтому необходимо изменить исходные файлы прописав правила обработки тегов расширений, как тегов внутри которых могут и будут присутствовать другие расширения.

При обновлении MediaWiki или Parsoid на другую версию необходимо изменить некоторые исходные файлы MediaWiki и Parsoid для корректной обработки и поддержки расширения VisualSmsMetaTags и аналогов

#Изменение в Parser MediaWiki
##Изменения MediaWiki для белого списка
Если расширение использует собственный тег, например <smsmeta> ... </smsmeta> , и при этом использует Hook для визуализации, то необходимо изменить файл /var/www/wiki/includes/parser/Parser.php, переписав его метод getTags() на

```
	public $mExcludeExtansionTags = [' 'smsmeta'];
	/**
	 * Accessor
	 *
	 * @return array
	 */
	public function getTags() {
		$return = [];
		$res = array_merge(
			array_keys( $this->mTransparentTagHooks ),
			array_keys( $this->mTagHooks ),
			array_keys( $this->mFunctionTagHooks ));
		foreach($res as $value) {
			if(!in_array($value, $this->mExcludeExtansionTags)){
				array_push($return, $value);
			}
		}
		return $return;
	}
```
где в переменной массива $mExcludeExtansionTags дописать необходимые теги.

Делается это для того чтобы парсоид не получал данные через API от Wiki о теге как о extension, а обрабатывал его как тег, внутри которого присутствуют другие расширения, сама wiki уже обработает этот тег в файлах расширения js, которые описаны в папке extensions.

## Изменения в Parsoid для белого списка
Что бы сам парсоид корректно обрабатывал контент внутри тега, а не оставлял его грязным wiki текстом, необходимо в файле /usr/lib/parsoid/src/lib/config/WikitextConstants.js дополнить необходимым тегом, например для VisualSmsMetaTags - <smsmeta>, разделы:

- Sanitizer в множестве TagWhiteList

```
** @namespace */
	Sanitizer: {
		/**
		 * List of whitelisted tags that can be used as raw HTML in wikitext.
		 * All other html/html-like tags will be spit out as text.
		 * @type {Set}
		 */
		TagWhiteList: new Set([
			// In case you were wondering, explicit <a .. > HTML is NOT allowed in wikitext.
			// That is why the <a> tag is missing from the white-list.
			...,
			' 'SMSMETA'
		]),
	},
```

- HTMLTagsWithWTEquivalents
```
/**
* These HTML tags have native wikitext representations.
* All other HTML tags would have to be emitted as HTML tags in wikitext.
* @type {Set}
*/
HTMLTagsWithWTEquivalents: new Set([
...,
 "SMSMETA"
]),
```

- HTML в множестве HTML5Tags и (HTML4BlockTags или HTML4InlineTags) в зависимости от типа в строке или блока:

```
/** @namespace */
	HTML: {
		/**
		 * The list of HTML5 tags, mainly used for the identification of *non*-html tags.
		 * Non-html tags terminate otherwise tag-eating rules in the tokenizer
		 * to support potential extension tags.
		 * @type {Set}
		 */
		HTML5Tags: new Set([
			...,
			" "SMSMETA"
		]),

		/**
		 * From {@link https://developer.mozilla.org/en-US/docs/HTML/Block-level_elements}.
		 * However, you probably want to use `Util.isBlockTag()`, where some
		 * exceptions are being made.
		 * @type {Set}
		 */
		HTML4BlockTags: new Set([
			...,
			''SMSMETA'
		]),

		/**
		 * From {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements}
		 * plus some non-strict elements not on that list (FONT, S, STRIKE, U) since
		 * these are tags that are actually used on wikipedias.
		 *
		 * All HTML5 formatting elements except NOBR are on this list.
		 * @type {Set}
		 */
		HTML4InlineTags: new Set([
			...
		]),
		...
	},
```


- в LocalSettings.php добавить:
```
wfLoadExtension( 'VisualSmsMetaTags' );
```
- необходимо заполнить переменную $wiki_url в SmsMetasHook.php, укажите адрес MediaWiki, напрмиер, https://wiki.ru/index.php/
- добавить database-svgrepo-com.svg и lamp-svgrepo-com.svg в skins/common/images
- добавить стили из VisualSmsMetaTags.css в customizations/custom.css
- добавить @import "/customizations/custom.css";  на странице /index.php/MediaWiki:Common.css

# Как использовать

Плагин создан для двух целей:
1. записать какую-либо историю, обсуждение по изменением (при создании блока используется тип "История").
2. быстро переходить к ER-модели по указанному полю базы данных (при создании блока используется типа "Поле БД")

- Чтобы добавить блок с типом "История", необходимо добавить через визуальный редактор
  блок, Вставить > "Метадата (блок)". Записать текст в блок(подсвечен зеленым цветом), нажать дважды по блоку -> Править -> выбрать тип "История"


- Чтобы добавить блок с типом "Поле БД", необходимо добавить через визуальный редактор
  блок, Вставить > "Метадата (блок)". Записать поле базы данных в блок(подсвечен зеленым цветом), например, User.Id, нажать дважды по блоку -> Править -> выбрать тип "Поле БД"

В режиме чтения текст в блоках будет скрыт, а на их месте появятся соответствующие иконки, также в тулбаре появится кнопка в виде лампочки.

При нажатии откроется модальное окно, в котором можно выбрать тип показываемого блока.


# Совместимость с ER-моделями
В различных статьях  могут описываться какие-либо поля в базе данных используя данный плагин(вставка модуля с типом "Поле БД") и хотелось бы по нажатию на него перейти в какую-то ER-модель. Для этого необходимо следующее:

- сама статья и статья с ER-моделью должны находиться в одном общем главном проекте. Например, статья доступна по ссылке https://medaiwiki.ru/Project/Page
- должна быть доступна например такая ссылка https://medaiwiki.ru/Project/_ER/, которая должна вести к статье со всеми ER-моделями, чтобы все таблицы были на одной странице
- таблицы на странице с ER-моделями должны быть в виде SVG
- после этого по нажатию на иконку появится хинт со ссылкой к ER-модели(если текст скрыт), если не скрыт, то ссылка будет видна сразу
