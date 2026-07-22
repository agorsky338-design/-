<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'message'=>'Метод не поддерживается']); exit; }
function clean($v,$max=3000){ $v=trim((string)$v); $v=strip_tags($v); return mb_substr($v,0,$max,'UTF-8'); }
if (!empty($_POST['company_website'] ?? '')) { echo json_encode(['ok'=>true]); exit; }
$name=clean($_POST['name'] ?? '',80);
$phone=clean($_POST['phone'] ?? '',40);
$email=filter_var(trim($_POST['email'] ?? ''),FILTER_VALIDATE_EMAIL) ?: '';
$type=clean($_POST['type'] ?? '',100);
$message=clean($_POST['message'] ?? '',3000);
if (mb_strlen($name)<2 || mb_strlen($phone)<5) { http_response_code(422); echo json_encode(['ok'=>false,'message'=>'Укажите имя и телефон']); exit; }
$to='info@prrk.ru'; // подтвердить адрес перед запуском
$subject='Заявка с сайта ПРРК Интерьер: '.$type;
$body="Новая заявка с сайта\n\nИмя: $name\nТелефон: $phone\nE-mail: $email\nТип задачи: $type\n\nСообщение:\n$message\n\nIP: ".($_SERVER['REMOTE_ADDR'] ?? '');
$domain=preg_replace('/^www\./','',$_SERVER['HTTP_HOST'] ?? 'prrk.ru');
$headers=[
 'MIME-Version: 1.0',
 'Content-Type: text/plain; charset=UTF-8',
 'From: Сайт ПРРК Интерьер <noreply@'.$domain.'>'
];
if ($email) $headers[]='Reply-To: '.$email;
$encoded='=?UTF-8?B?'.base64_encode($subject).'?=';
$sent=@mail($to,$encoded,$body,implode("\r\n",$headers));
if (!$sent) { http_response_code(503); echo json_encode(['ok'=>false,'message'=>'Почтовая функция сервера не настроена']); exit; }
echo json_encode(['ok'=>true]);
?>