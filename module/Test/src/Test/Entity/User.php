<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;

/** @ORM\Entity */

class User {

    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $name;
	
	/** @ORM\Column(type="string", length=255, unique=true) */
	protected $email;
	
	/** @ORM\Column(type="string", length=255, unique=true)) */
	protected $username;
	
	public function getId(){
	    return $this->id;
	}

    public function getEmail(){
    	return $this->email;
    }
    
    public function getUsername(){
    	return $this->username;
    }
    
    public function getName(){
    	return $this->name;
    }
    
    public function setId($id){
        $this->id = $id;
    }
    
    public function setEmail($email){
    	$this->email = $email;
    }
    
    public function setUsername($username){
    	$this->username = $username;
    }
    
    public function setName($name){
    	$this->name = $name;
    }
}
