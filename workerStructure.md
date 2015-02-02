##Algorithm IV Web Worker Structure (v1.0.0)
####An outline of all the variables, methods, and classes contained within the [Algorithm IV Web Worker](https://github.com/imaginate/SalgorithmIV/blob/master/src/algorithmIVData.js#L470-2208).


Web Worker Overview ||||
Public Variables   | Public Classes
:----------------- | :-----------------
configuration      | ParseQuestions
categories         | FormatQuestion
sources            | PrettifyCode
questions          | 

FormatQuestion Class |||
Public Methods     | Private Variables  | Private Methods
:----------------- | :----------------- | :-----------------
init               | formatted          | init
                   |                    | clearFormat
                   |                    | formatID
                   |                    | formatSource
                   |                    | formatComplete
                   |                    | formatCategory
                   |                    | formatSolution
                   |                    | formatOutput
                   |                    | formatLinks

PrettifyCode Class ||||
Public Methods     | Private Variables  | Private Methods    | Private Classes
:----------------- | :----------------- | :----------------- | :-----------------
init               | linePadding        | init               | HighlightSyntax
                   | paddingLevel       | setPadding         |
                   | likelyRegex        | prepareLine        |
                   | plainNumbers       | formatLines        |
                   | hexNumbers         | prepareArray       |
                   | identifierStart    |                    |
                   | identifiers        |                    |
                   | keywords           |                    |
                   | commentOpen        |                    |

HighlightSyntax Class |||
Public Methods     | Private Variables  | Private Methods
:----------------- | :----------------- | :-----------------
init               | newLine            | _init
                   | line               | setLine
                   | len                | sanitizeCharacter
                   |                    | skipComment
                   |                    | skipString
                   |                    | skipSpace
                   |                    | skipNumber
                   |                    | skipIdentifier
                   |                    | formatCommentOpen
                   |                    | formatCommentClose
                   |                    | formatLineComment
                   |                    | formatString
                   |                    | formatRegex
                   |                    | formatSpace
                   |                    | formatBracket
                   |                    | formatOperator
                   |                    | formatComma
                   |                    | formatSemicolon
                   |                    | formatColon
                   |                    | formatPeriod
                   |                    | formatNumber
                   |                    | formatIdentifier
                   |                    | formatMisc