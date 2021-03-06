<?php

return [
  /*
    |---------------------------------------------------------------------------
    | Exceptions Codes
    |---------------------------------------------------------------------------
    |
    | This values determine the code of each exception. This codes are useful
    | to identify the errors generated by your API. You can set your own codes
    | and add more fields, validation rules and codes to `validation_fields`
    | array. The `default` code is from not managed exceptions.
    */
  'codes' => [
    'default' => 1,
    'authorization' => 12,
    'model_not_found' => 13,
    'validation' => 14,
    'validation_fields' => [
      'name' => [
        'default' => 141,
        'required' => 1411,
        'string' => 1412,
      ],
      'email' => [
        'default' => 142,
        'email' => 1421,
      ],
      'password' => [
        'default' => 143,
        'string' => 1431,
        'confirmed' => 1432,
        'min' => 1433,
      ],
    ],
    'not_found_http' => 15,
    'authentication' => 16,
    'oauth_server' => 17,
    'bad_request' => 18,
  ],

  /*
    |---------------------------------------------------------------------------
    | Default Http Code
    |---------------------------------------------------------------------------
    |
    | The http code value to not managed exceptions. Generally the code used is
    | 500 - Internal Server Error.
    */
  'http_code' => 500,

  /*
    |---------------------------------------------------------------------------
    | Response Handler
    |---------------------------------------------------------------------------
    |
    | Any class the extends of \SMartins\Exceptions\Response\AbstractResponse.
    */
  'response_handler' => \SMartins\Exceptions\JsonApi\Response::class,

  /*
    |---------------------------------------------------------------------------
    | Exception Handler
    |--------------------------------------------------------------------------
    |
    | The class that will handler the exceptions.
    */
  'exception_handler' => \SMartins\Exceptions\Handlers\Handler::class,
];
