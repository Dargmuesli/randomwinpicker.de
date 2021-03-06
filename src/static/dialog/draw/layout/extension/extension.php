<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    include_once $_SERVER['DOCUMENT_ROOT'].'/resources/dargmuesli/database/pdo.php';
    include_once $_SERVER['DOCUMENT_ROOT'].'/resources/dargmuesli/filesystem/environment.php';
    include_once $_SERVER['DOCUMENT_ROOT'].'/resources/dargmuesli/translation/translations.php';
    include_once $_SERVER['DOCUMENT_ROOT'].'/resources/dargmuesli/sessioncookie.php';

    // Load .env file
    load_env_file($_SERVER['SERVER_ROOT'].'/credentials');

    // Get database handle
    $dbh = get_dbh($_ENV['PGSQL_DATABASE']);

    $arrayToReturn = [];

    $participants = null;

    if (isset($email) && isset($_COOKIE['participants'])) {
        if (count($_COOKIE['participants']) > 0) {
            $participants = $_COOKIE['participants'];
        }
    } elseif (isset($_SESSION['participants'])) {
        if (count($_SESSION['participants']) > 0) {
            $participants = $_SESSION['participants'];
        }
    }

    $arrayToReturn['participants'] = $participants;
    $items = null;

    if (isset($email) && isset($_COOKIE['items'])) {
        if (count($_COOKIE['items']) > 0) {
            $items = $_COOKIE['items'];
        }
    } elseif (isset($_SESSION['items'])) {
        if (count($_SESSION['items']) > 0) {
            $items = $_SESSION['items'];
        }
    }

    $arrayToReturn['items'] = $items;

    if (sizeof($participants) < sizeof($items)) {
        $_SESSION['error'] = translate('scripts.draw.error');
    }

    $quantity = -1;

    if (isset($_SESSION['quantity'])) {
        $quantity = $_SESSION['quantity'];
    }

    $arrayToReturn['round'] = $quantity;

    if (!empty($email)) {

        // Initialize the required table
        init_table($dbh, 'accounts');

        $stmt = $dbh->prepare('SELECT prices FROM accounts WHERE mail = :email');
        $stmt->bindParam(':email', $email);

        if (!$stmt->execute()) {
            throw new PDOException($stmt->errorInfo()[2]);
        }

        $pricesQuery = $stmt->fetch()[0];
        $arrayToReturn['prices'] = $pricesQuery;
    }

    echo htmlspecialchars_decode(json_encode($arrayToReturn));
