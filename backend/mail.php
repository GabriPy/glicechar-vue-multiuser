<?php
/**
 * PHP Mailer Script for GliceChart
 * This script allows sending emails via PHP mail() function,
 * avoiding the need for external SMTP services.
 * 
 * Usage: Send a POST request with JSON body:
 * {
 *   "secret": "YOUR_SECRET_KEY",
 *   "to": "recipient@example.com",
 *   "subject": "Email Subject",
 *   "html": "<h1>HTML Content</h1>"
 * }
 */

// --- CONFIGURATION ---
// Change this to a secure random string and set it in your .env as PHP_MAILER_SECRET
$SECRET_KEY = "glicechart_secret_mail_key"; 
$FROM_EMAIL = "noreply@mglicechart.ghibiri.it";
$FROM_NAME  = "GliceChart";
// ---------------------

header('Content-Type: application/json');

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

// Security Check
if (!isset($data['secret']) || $data['secret'] !== $SECRET_KEY) {
    http_response_code(403);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$to      = $data['to'];
$subject = $data['subject'];
$message = $data['html'];

if (empty($to) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

// Headers for HTML email
$headers  = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: " . $FROM_NAME . " <" . $FROM_EMAIL . ">" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "PHP mail() function failed"]);
}
?>