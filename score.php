<?php

try{
$pdo = new PDO("mysql:dbname=timeline;host=localhost","root", "");
} catch(PDOException $e){
    echo $e->getMessage();
}
if( isset($_POST['name']) && !empty($_POST['name']) 
    && isset($_POST['over']) && !empty($_POST['over'])){
    $name = $_POST['name'];
    $overheal = $_POST['over'];
    $numBarras = $_POST['hb'];
} else{
    $name = null;
    $overheal = null;
    $numBarras = null;
}
$statement = "insert into score set name=?, overheal=?, Healthbars=?";
$sql = $pdo->prepare($statement);
$sql->execute(array($name,$overheal,$numBarras));

$statement = "select * from score order by overheal limit 10";
$sql = $pdo->prepare($statement);
$sql->execute();

$sql = "select * from score order by Healthbars DESC, overheal limit 15";
$sql = $pdo->query ($sql);
if($sql->rowCount() > 0){
    foreach($sql->fetchAll() as $person){
        echo '<tr>';
        echo '<td>'.$person['name'].'</td>';
        echo '<td>'.$person['overheal'].'</td>';
        echo '<td>'.$person['Healthbars'].'</td>';
        echo '</tr>';
    }
}   
?>
