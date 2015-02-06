<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

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
	
	/** @ORM\Column(type="string", length=25, nullable=true) */
	protected $password;
	
	/** @ORM\Column(type="string", length=255, unique=true) */
	protected $username;
	
	/** @ORM\ManyToMany(targetEntity="Group") */
	protected $groups;
	
	/** @ORM\ManyToMany(targetEntity="Ticket") */
	protected $tracks;
	
	public function __construct(){
		$this->groups = new ArrayCollection();
		$this->tracks = new ArrayCollection();
	}
	
	public function getId(){
	    return $this->id;
	}

    public function setId($id){
        $this->id = $id;
    }
    
    public function getEmail(){
    	return $this->email;
    }
    
    public function setEmail($email){
    	$this->email = $email;
    }

    public function getUsername(){
    	return $this->username;
    }
    
    public function setUsername($username){
    	$this->username = $username;
    }

    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }
    
    public function getPassword(){
    	return $this->password;
    }
    public function setPassword($password){
    	$this->password = $password;
    }
    
    public function getGroups(){
        return $this->groups;
    }
    
    public function setGroups($groups){
    	$this->groups = $groups;
    }
    
    public function getTraks(){
    	return $this->traks;
    }
    
    public function setTracks($tracks){
    	$this->tracks = $tracks;
    }
}
