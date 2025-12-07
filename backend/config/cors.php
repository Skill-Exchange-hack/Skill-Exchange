<?php

return [
    'paths' => ['api/*'], // API のパスを指定
    'allowed_methods' => ['*'], // 全てのHTTPメソッドを許可
    'allowed_origins' => ['http://localhost:3000'], // React 開発サーバー
    'allowed_headers' => ['*'], // 全てのヘッダーを許可
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
