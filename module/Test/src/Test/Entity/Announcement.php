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
	
	/** @ORM\ManyToOne(targetEntity="User") */
	protected $author;
	
	/** @ORM\Column(type="datetime", nullable=false) */
	protected $lastchange;
	
	/** @ORM\ManyToMany(targetEntity="Group", inversedBy="announcements") */
	protected $groups;
	
	/** @ORM\Column(type="boolean", nullable=true) */
	protected $broadcast;
	
	/** @ORM\Column(type="boolean", nullable=true) */
	protected $warning;
	
	public function __construct(){
		$this->groups = new ArrayCollection();
		$this->lastchange = new \DateTime("now");
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
    
    public function setLastchange($lastchange = null){
    	if ( $lastchange ){
    	    $this->lastchange = $lastchange;
    	} else
    	    $this->lastchange = new \DateTime("now");
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
    	$this->broadcast = $broadcast;
    }    
    
    public function isWarning(){
    	return $this->warning?:false;
    }
    
    public function setWarning($warning){
    	$this->warning = $warning;
    }
    
    public function toArray()
    {
        $array = get_object_vars($this);
        $array['author'] = $array['author']->getFullname(); 
        $array['lastchange'] = $array['lastchange']->format('d-m-Y H:i:s');
        unset($array['groups']);
        
        return $array;
    }
}