<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** 
 * @ORM\Entity
 */
class Announcement {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=500) */
	protected $message;
	
	/** @ORM\OneToOne(targetEntity="User") */
	protected $author;
	
	/** @ORM\Column(type="datetime") */
	protected $lastchange;
	
	/** @ORM\ManyToMany(targetEntity="Group") */
	protected $groups;
	
	/** @ORM\Column(type="boolean", nullable=true) */
	protected $broadcast;
	
	public function __construct(){
		$this->groups = new ArrayCollection();
	}
	
	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getMessage(){
    	return $this->message;
    }
    
    public function setMessage($message){
    	$this->message = $message;
    }
    
    public function getAuthor(){
    	return $this->author;
    }
    
    public function setAuthor($author){
    	$this->author = $author;
    }
    
    public function getLastchange(){
    	return $this->lastchange;
    }
    
    public function setLastchange($lastchange){
    	$this->grants = $lastchange;
    }
    
    public function getGroups(){
    	return $this->groups;
    }
    
    public function setGroups($groups){
    	$this->groups = $groups;
    }
    
    public function isBroadcast(){
    	return $this->broadcast?:false;
    }
    
    public function setBroadcast($broadcast){
    	$this->grants = $broadcast;
    }
}